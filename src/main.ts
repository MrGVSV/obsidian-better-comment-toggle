import { Editor, MarkdownView, Plugin } from 'obsidian';
import { comparePos, getCommentTokens, Ordering } from './utility';
import { LineCommentController } from './toggle';
import { SettingsTab } from './settings';
import { EditorView } from '@codemirror/view';
import { CommentViewPlugin } from './extensions';
import { Settings } from './settings';
import { DEFAULT_SETTINGS } from './settings';

export default class BetterMarkdownCommentsPlugin extends Plugin {
	public settings: Settings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new SettingsTab(this.app, this));

		this.addCommand({
			id: 'better-markdown-comments--toggle',
			icon: 'percent',
			name: 'Toggle Comment',
			hotkeys: [{ key: '/', modifiers: ['Mod'] }],
			editorCallback: (editor: Editor, _view: MarkdownView) => {
				this.onToggleComment(editor);
			},
		});

		this.registerEditorExtension(CommentViewPlugin.createExtension(this.settings));
	}

	onunload() {}

	async loadSettings() {
		const storedSettings: Settings = await this.loadData();

		this.settings = {
			...DEFAULT_SETTINGS,
			...storedSettings,
			appearance: {
				...DEFAULT_SETTINGS.appearance,
				...storedSettings.appearance,
			},
		};
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	/**
	 * Refresh the appearance of comments.
	 *
	 * @see {@link refreshAppearanceOverride} to refresh the override setting.
	 */
	public refreshAppearance() {
		const editorView = this.activeEditorView;
		if (!editorView) {
			return;
		}

		CommentViewPlugin.updateAppearance(editorView, this.settings.appearance);
	}

	/**
	 * Refresh the appearance override of comments.
	 *
	 * @see {@link refreshAppearance} to refresh the appearance setting.
	 */
	public refreshAppearanceOverride() {
		const editorView = this.activeEditorView;
		if (!editorView) {
			return;
		}

		CommentViewPlugin.updateEnabled(editorView, this.settings.overrideAppearance);
	}

	private get activeEditorView(): EditorView | undefined {
		const editor = this.app.workspace.activeEditor?.editor;
		if (!editor) {
			return undefined;
		}

		// https://docs.obsidian.md/Plugins/Editor/Communicating+with+editor+extensions
		// @ts-expect-error: not typed
		return editor.cm as EditorView;
	}

	private onToggleComment(editor: Editor) {
		const controller = new LineCommentController(editor, this.settings);

		// Get the current range
		const from = editor.getCursor('from');
		const to = editor.getCursor('to');
		const anchor = editor.getCursor('anchor');
		const head = editor.getCursor('head');

		const hasSelection = comparePos(anchor, head) !== Ordering.Equal;

		const [commentStart] = getCommentTokens(this.settings);

		if (!hasSelection && editor.getLine(from.line).trim().length === 0) {
			// Allow turning single empty lines into comments
			controller.toggle(from.line);
			editor.transaction({
				changes: controller.takeChanges(),
				selection: {
					from: {
						line: from.line,
						ch: commentStart.length + 1,
					},
				},
			});
			return;
		}

		const rangeState = controller.rangeState(from.line, to.line);
		const selection = { anchor, head };

		for (let line = from.line; line <= to.line; line++) {
			// === Skip Empty Lines === //
			const text = editor.getLine(line);
			if (text.trim().length === 0) {
				continue;
			}

			// === Toggle Line === //
			const { before, after } = controller.toggle(line, {
				forceComment: !rangeState || rangeState === 'mixed',
			});
			const wasChanged = before.isCommented !== after.isCommented;
			const headBefore = { ...selection.head };

			// === Update Selection === //
			// --- Anchor --- //
			if (line === anchor.line && wasChanged) {
				selection.anchor.ch = after.isCommented
					? anchor.ch + commentStart.length + 1
					: anchor.ch - commentStart.length - 1;

				selection.anchor.ch = Math.clamp(selection.anchor.ch, 0, after.text.length);
			}

			// --- Head --- //
			if (line === head.line && wasChanged) {
				selection.head.ch = after.isCommented
					? head.ch + commentStart.length + 1
					: head.ch - commentStart.length - 1;

				selection.head.ch = Math.clamp(selection.head.ch, 0, after.text.length);
			}

			// === Drop Cursor === //
			if (this.settings.dropCursor && !hasSelection && selection.head.line !== editor.lastLine()) {
				selection.head.line = Math.min(selection.head.line + 1, editor.lastLine());
				selection.head.ch = Math.min(
					// If at start of line -> keep at start of next line
					headBefore.ch === 0
						? 0
						: // If at end of line -> keep at end of next line
						headBefore.ch === before.text.length || headBefore.ch === text.length
						? Infinity
						: // If just commented -> account for start comment token
						after.isCommented
						? selection.head.ch - commentStart.length - 1
						: selection.head.ch,
					editor.getLine(selection.head.line).length,
				);

				selection.anchor.line = selection.head.line;
				selection.anchor.ch = selection.head.ch;
			}
		}

		editor.transaction({
			changes: controller.takeChanges(),
			selection: {
				from: selection.anchor,
				to: selection.head,
			},
		});
	}
}
