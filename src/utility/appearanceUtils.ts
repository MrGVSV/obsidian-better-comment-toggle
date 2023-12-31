import { CommentAppearance } from '../settings';

/**
 * Build a CSS style string from the given {@link CommentAppearance}.
 */
export function buildStyleString(appearance: CommentAppearance): string {
	const { backgroundColor, showBackground, color, fontTheme, customFont, italic, weight, showOutline, outlineColor } =
		appearance;

	const props: string[] = [];

	props.push(`color: ${color}`);
	props.push(`font-weight: ${weight}`);
	italic && props.push('font-style: italic');
	showBackground && props.push(`background-color: ${backgroundColor}`);
	showOutline &&
		props.push(
			`text-shadow: ${outlineColor} -1px -1px 1px, ${outlineColor} 1px -1px 1px, ${outlineColor} -1px 1px 1px, ${outlineColor} 1px 1px 1px`,
		);

	switch (fontTheme) {
		case 'default':
			break;
		case 'monospace':
			props.push('font-family: monospace');
			break;
		case 'custom':
			props.push(`font-family: ${customFont}`);
			break;
	}

	return props.join('; ');
}
