import { EditorView } from '@codemirror/view';
import { Editor } from 'obsidian';
import { syntaxTree } from '@codemirror/language';

/**
 * Extract a CodeMirror {@link EditorView} from an Obsidian {@link Editor}.
 */
export function extractEditorView(editor: Editor): EditorView {
	// https://docs.obsidian.md/Plugins/Editor/Communicating+with+editor+extensions
	// @ts-expect-error: not typed
	return editor.cm as EditorView;
}

/**
 * Regex for extracting the language from the starting line of a code block.
 */
const CODE_LANG_REGEX = /^```(.*)$/;

/**
 * Find the language of the code block at the given line.
 *
 * If the line is not in a code block, returns `null`.
 * If it is in a code block, returns the language name (or any text following the starting "```").
 */
export function findCodeLang(editor: Editor, line: number): string | null {
	const view = extractEditorView(editor);

	// Lines are 1-indexed so we need to add 1
	const linePos = view.state.doc.line(line + 1).from;

	// Set `side` to `1` so we only get the node starting at this line (i.e. not the topmost `Document`)
	const cursor = syntaxTree(view.state).cursorAt(linePos, 1);

	// First, check if we're in a code block
	if (!cursor.type.name.contains('hmd-codeblock')) {
		return null;
	}

	// Find the start of the code block
	let found = false;
	let { from, to } = cursor;
	do {
		// Find the boundary where the code block starts
		if (!cursor.type.name.contains('codeblock')) {
			found = true;
			break;
		}

		from = cursor.from;
		to = cursor.to;
	} while (cursor.prev());

	if (!found) {
		return null;
	}

	const text = view.state.sliceDoc(from, to);
	const matches = CODE_LANG_REGEX.exec(text);
	return matches?.at(1)?.trim() ?? null;
}