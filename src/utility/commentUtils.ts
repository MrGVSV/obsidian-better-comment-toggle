import { Settings } from '../settings';

/**
 * Return a tuple of the start and end comment tokens for the given {@link Settings}.
 */
export function getCommentTokens(settings: Settings): [string, string] {
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
export function buildCommentString(text: string, settings: Settings): string {
	const [commentStart, commentEnd] = getCommentTokens(settings);
	const end = commentEnd ? ` ${commentEnd}` : '';

	return `${commentStart} ${text}${end}`;
}
