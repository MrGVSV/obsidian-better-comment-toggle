import { FlatSettings, Settings, SettingsPath } from './types';
import { DEFAULT_SETTINGS } from './defaults';
import { DeepReadonly } from '../utility';

/**
 * Returns the value of the given setting path.
 */
export function getSetting<P extends SettingsPath>(settings: DeepReadonly<Settings>, path: P): FlatSettings[P] {
	const parts = path.split('.');
	let obj: unknown = settings;
	for (const part of parts) {
		obj = (obj as Record<string, unknown>)[part];
	}

	return obj as FlatSettings[P];
}

/**
 * Sets the given setting path to the given value.
 */
export function setSetting<P extends SettingsPath>(settings: Settings, path: P, value: FlatSettings[P]) {
	const parts = path.split('.');
	const key = parts.pop();
	if (key === undefined) {
		throw new Error('Invalid settings path');
	}

	let obj: unknown = settings;
	for (const part of parts) {
		obj = (obj as Record<string, unknown>)[part];
	}

	(obj as Record<string, unknown>)[key] = value;
}

/**
 * Restores the default value for the given settings paths.
 */
export function restoreSettings(settings: Settings, ...paths: SettingsPath[]) {
	for (const path of paths) {
		const value = getSetting(DEFAULT_SETTINGS, path);
		setSetting(settings, path, value);
	}
}

/**
 * Returns true if _all_ the given settings paths are set to their default values.
 */
export function isDefaultSettings(settings: Settings, ...paths: SettingsPath[]): boolean {
	for (const path of paths) {
		const defaultValue = getSetting(DEFAULT_SETTINGS, path);
		const currentValue = getSetting(settings, path);
		if (defaultValue !== currentValue) {
			return false;
		}
	}
	return true;
}
