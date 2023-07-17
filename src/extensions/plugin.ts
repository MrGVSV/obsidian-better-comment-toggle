import { Decoration, DecorationSet, EditorView, PluginValue, ViewPlugin, ViewUpdate } from '@codemirror/view';
import { Extension, RangeSetBuilder } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';
import { CommentAppearance, Settings } from '../settings';
import { buildStyleString } from '../utility';
import { appearanceSettingsField, enableAppearanceField, setAppearanceSettings, setEnableAppearance } from './fields';

export class CommentViewPlugin implements PluginValue {
	private decorations: DecorationSet;

	constructor(view: EditorView) {
		this.decorations = this.buildDecorations(view);
	}

	/**
	 * Create the extension for the plugin, with all its required fields.
	 */
	public static createExtension(settings: Settings): Extension {
		return [
			enableAppearanceField.init(() => settings.overrideAppearance),
			appearanceSettingsField.init(() => settings.appearance),
			ViewPlugin.fromClass(CommentViewPlugin, {
				decorations: (value) => value.decorations,
			}),
		];
	}

	/**
	 * Update the appearance settings for the plugin in the given view.
	 */
	public static updateAppearance(view: EditorView, appearance: CommentAppearance) {
		view.dispatch({
			effects: [setAppearanceSettings.of(appearance)],
		});
	}

	/**
	 * Update the enabled state for the plugin in the given view.
	 */
	public static updateEnabled(view: EditorView, enabled: boolean) {
		view.dispatch({
			effects: [setEnableAppearance.of(enabled)],
		});
	}

	update(update: ViewUpdate) {
		if (update.docChanged || update.viewportChanged) {
			this.decorations = this.buildDecorations(update.view);
			return;
		}

		for (const effect of update.transactions.flatMap((trn) => trn.effects)) {
			if (effect.is(setAppearanceSettings) || effect.is(setEnableAppearance)) {
				this.decorations = this.buildDecorations(update.view);
				return;
			}
		}
	}

	destroy() {}

	buildDecorations(view: EditorView): DecorationSet {
		if (!view.state.field(enableAppearanceField)) {
			return this.emptyDecorationSet;
		}

		const builder = new RangeSetBuilder<Decoration>();

		const appearance = view.state.field(appearanceSettingsField);
		const style = buildStyleString(appearance);

		for (const { from, to } of view.visibleRanges) {
			syntaxTree(view.state).iterate({
				from,
				to,
				enter: (node) => {
					if (node.type.name !== 'comment') {
						return;
					}

					builder.add(
						node.from,
						node.to,
						Decoration.mark({
							attributes: {
								style,
							},
						}),
					);
				},
			});
		}

		return builder.finish();
	}

	private get emptyDecorationSet(): DecorationSet {
		return new RangeSetBuilder<Decoration>().finish();
	}
}
