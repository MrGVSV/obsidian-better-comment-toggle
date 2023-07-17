import { EditorPosition } from 'obsidian';

/**
 * Escape the given text for use in a regular expression.
 *
 * @see https://stackoverflow.com/a/6969486/11571888
 */
export function escapeRegex(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export enum Ordering {
	Less = -1,
	Equal = 0,
	Greater = 1,
}

/**
 * Compare two {@link EditorPosition}s.
 *
 * First compares the line numbers, then the character positions.
 *
 * The resulting {@link Ordering} always follows `a` ORDERING `b`:
 * - If `a` is less than `b`, the result is {@link Ordering.Less}
 * - If `a` is equal to `b`, the result is {@link Ordering.Equal}
 * - If `a` is greater than `b`, the result is {@link Ordering.Greater}
 */
export function comparePos(a: EditorPosition, b: EditorPosition): Ordering {
	if (a.line < b.line) {
		return Ordering.Less;
	}

	if (a.line > b.line) {
		return Ordering.Greater;
	}

	if (a.ch < b.ch) {
		return Ordering.Less;
	}

	if (a.ch > b.ch) {
		return Ordering.Greater;
	}

	return Ordering.Equal;
}
