import { StateEffect, StateField } from '@codemirror/state';
import { CommentAppearance, DEFAULT_SETTINGS } from '../settings';

export const setEnableAppearance = StateEffect.define<boolean>();
export const enableAppearanceField = StateField.define({
	create: () => false,
	update: (value, transaction) => {
		for (const effect of transaction.effects) {
			if (effect.is(setEnableAppearance)) {
				return effect.value;
			}
		}

		return value;
	},
});

export const setAppearanceSettings = StateEffect.define<Partial<CommentAppearance>>();
export const appearanceSettingsField = StateField.define<CommentAppearance>({
	create: () => ({ ...DEFAULT_SETTINGS.appearance }),
	update: (value, transaction) => {
		for (const effect of transaction.effects) {
			if (effect.is(setAppearanceSettings)) {
				value = {
					...value,
					...effect.value,
				};
			}
		}

		return value;
	},
});
