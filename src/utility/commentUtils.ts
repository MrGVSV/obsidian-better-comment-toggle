import { Settings } from '../settings';
import { Languages } from '../settings/language';
import { Editor } from 'obsidian';
import { containsMathBlockTokens } from './editorUtils';

/**
 * Return a tuple of the start and end comment tokens for the given {@link Settings}.
 */
export function getCommentTokens(settings: Settings, lang: string | null): [string, string] {
	if (lang) {
		for (const { commentEnd, commentStart, regex } of settings.customLanguages) {
			if (regex.trim().length === 0) {
				continue;
			}

			if (new RegExp(regex, 'i').test(lang)) {
				return [commentStart, commentEnd];
			}
		}

		const standard = Languages.get(lang);
		if (standard) {
			return [standard.commentStart, standard.commentEnd];
		}

		// By default, don't comment anything
		return ['', ''];
	}

	switch (settings.commentStyle) {
		case 'html':
			return ['<!--', '-->'];
		case 'obsidian':
			return ['%%', '%%'];
		case 'custom':
			return [settings.customCommentStart, settings.customCommentEnd];
		default:
			throw new Error(`Unknown comment kind: ${settings.commentStyle}`);
	}
}

/**
 * Build a comment string from the given text and {@link Settings}.
 */
export function buildCommentString(text: string, commentStart: string, commentEnd: string): string {
	const end = commentEnd ? ` ${commentEnd}` : '';

	return `${commentStart} ${text}${end}`;
}

/**
 * Returns true if the given line should not have its comment state toggled by this plugin.
 */
export function shouldDenyComment(editor: Editor, line: number): boolean {
	const text = editor.getLine(line).trim();
	return (
		text.length === 0 || text.startsWith('```') || text.startsWith('$$') || containsMathBlockTokens(editor, line)
	);
}
