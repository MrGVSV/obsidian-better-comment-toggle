import { Flatten } from '../utility';

export interface Settings {
	commentStyle: CommentStyle;
	customCommentStart: string;
	customCommentEnd: string;
	/**
	 * If true, the cursor will be dropped to the next line after toggling a comment.
	 */
	dropCursor: boolean;
	/**
	 * If true, overrides the appearance of commented lines with {@link appearance}.
	 */
	overrideAppearance: boolean;
	appearance: CommentAppearance;
	customLanguages: CustomLanguage[];
}

export interface CommentAppearance {
	showBackground: boolean;
	backgroundColor: string;
	color: string;
	fontTheme: CommentFontTheme;
	customFont: string;
	italic: boolean;
	weight: number;
	showOutline: boolean;
	outlineColor: string;
}

export interface CustomLanguage {
	regex: string;
	commentStart: string;
	commentEnd: string;
}

/**
 * The various styles (or, "flavors") of comments that can be used.
 *
 * - `html`: HTML comments (`<!-- -->`).
 * - `obsidian`: Obsidian comments (`%% %%`).
 * - `custom`: Custom comments, specified by {@link Settings.customCommentStart} and {@link Settings.customCommentEnd}.
 */
export type CommentStyle = 'html' | 'obsidian' | 'custom';

export type CommentFontTheme = 'default' | 'monospace' | 'custom';

export type FlatSettings = Flatten<Settings>;
export type SettingsPath = keyof FlatSettings;
