import { Settings } from '../settings';
import { Languages } from '../settings/language';

/**
 * Return a tuple of the start and end comment tokens for the given {@link Settings}.
 */
export function getCommentTokens(settings: Settings, lang: string | null): [string, string] {
	if (lang) {
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
 * Returns true if the given text should not have its comment state toggled by this plugin.
 * @param text The text of the line to check
 */
export function shouldDenyComment(text: string): boolean {
	const txt = text.trim();
	return txt.length === 0 || txt.startsWith('```');
}
