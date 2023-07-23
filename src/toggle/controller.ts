import { Editor, EditorChange } from 'obsidian';
import { buildCommentString, escapeRegex, findCodeLang, getCommentTokens, shouldDenyComment } from '../utility';
import { Settings } from '../settings';
import { LineState, RangeState, ToggleResult } from './types';

/**
 * Controller for toggling line comments.
 */
export class LineCommentController {
	/**
	 * The set of uncommitted changes that have been made by this controller.
	 */
	private changes: EditorChange[] = [];

	constructor(
		private editor: Editor,
		private settings: Settings,
	) {}

	/**
	 * Take the uncommitted changes that have been made by this controller.
	 *
	 * This will drain the list, leaving it empty and ready for future use.
	 */
	public takeChanges(): EditorChange[] {
		const changes = this.changes;
		this.changes = [];
		return changes;
	}

	/**
	 * Toggle the comment state of the given line.
	 */
	public toggle(line: number, options: ToggleOptions = {}): ToggleResult {
		const original = this.editor.getLine(line);
		const indent = Math.max(original.search(/\S/), 0);

		const { state, commentStart, commentEnd } = this.lineState(line);
		const { isCommented, text } = state;

		if (commentStart.length === 0 && commentEnd.length === 0) {
			return { before: state, after: state, commentStart, commentEnd };
		}

		if (isCommented) {
			if (options.forceComment) {
				// Line is commented -> do nothing
				return { before: state, after: state, commentStart, commentEnd };
			}

			// Line is commented -> uncomment
			this.addChange(line, text, indent);
			return { before: state, after: { isCommented: false, text }, commentStart, commentEnd };
		} else {
			// Line is uncommented  -> comment
			const newText = buildCommentString(text, commentStart, commentEnd);
			this.addChange(line, newText, indent);
			return {
				before: state,
				after: { isCommented: true, text: newText },
				commentStart,
				commentEnd,
			};
		}
	}

	/**
	 * Get the current comment state of the given range.
	 */
	public rangeState(fromLine: number, toLine: number): RangeState | null {
		let rangeState: RangeState | null = null;
		for (let line = fromLine; line <= toLine; line++) {
			const text = this.editor.getLine(line);
			if (shouldDenyComment(text)) {
				continue;
			}

			const { isCommented } = this.lineState(line).state;

			switch (rangeState) {
				case null:
					rangeState = isCommented ? 'commented' : 'uncommented';
					break;
				case 'commented':
					rangeState = isCommented ? 'commented' : 'mixed';
					break;
				case 'uncommented':
					rangeState = isCommented ? 'mixed' : 'uncommented';
					break;
				case 'mixed':
					// Do nothing
					break;
			}
		}

		return rangeState;
	}

	/**
	 * Get the current comment state of the given line.
	 */
	private lineState(line: number): LineStateResult {
		const lang = findCodeLang(this.editor, line);
		const [commentStart, commentEnd] = getCommentTokens(this.settings, lang);

		const regex = this.buildCommentRegex(commentStart, commentEnd);
		const text = this.editor.getLine(line);
		const matches = regex.exec(text);

		if (matches === null) {
			return { state: { isCommented: false, text: text.trim() }, commentStart, commentEnd };
		}

		const innerText = matches[1];
		return { state: { isCommented: true, text: innerText.trim() }, commentStart, commentEnd };
	}

	/**
	 * Build a regex that matches the comment tokens according to the line's context and
	 * current {@link Settings}.
	 *
	 * Contains one unnamed capture group containing the text between the comment tokens.
	 */
	private buildCommentRegex(commentStart: string, commentEnd: string): RegExp {
		const start = escapeRegex(commentStart);
		const end = escapeRegex(commentEnd);
		return new RegExp(`${start}\\s*(.*)\\s*${end}`);
	}

	/**
	 * Add a change to the list of changes to be applied to the editor.
	 *
	 * @param line The affected line.
	 * @param text The new text for the line.
	 * @param indent The indent of the line (i.e. where to insert the text).
	 */
	private addChange(line: number, text: string, indent = 0) {
		return this.changes.push({
			from: { line, ch: indent },
			to: { line, ch: this.editor.getLine(line).length },
			text,
		});
	}
}

interface ToggleOptions {
	forceComment?: boolean;
}

interface LineStateResult {
	state: LineState;
	commentStart: string;
	commentEnd: string;
}
