import { CustomLanguage, Settings } from './types';
import { DeepReadonly } from '../utility';

export const DEFAULT_SETTINGS: DeepReadonly<Settings> = {
	overrideAppearance: false,
	commentStyle: 'html',
	customCommentStart: '<!--',
	customCommentEnd: '-->',
	dropCursor: false,
	appearance: {
		showBackground: false,
		backgroundColor: '#191919',
		color: '#565E67',
		italic: false,
		weight: 400,
		showOutline: false,
		outlineColor: '#FFFFFF',
	},
	customLanguages: [],
};

/**
 * Generates an empty {@link CustomLanguage}.
 */
export function emptyLang(): CustomLanguage {
	return {
		regex: '',
		commentStart: '',
		commentEnd: '',
	};
}
