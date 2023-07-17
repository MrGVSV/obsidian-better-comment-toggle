import { App, PluginSettingTab, Setting } from 'obsidian';
import BetterMarkdownCommentsPlugin from '../main';
import { buildCommentString, buildStyleString } from '../utility';
import { CommentStyle, SettingsPath } from './types';
import { isDefaultSettings, restoreSettings } from './utils';

export class SettingsTab extends PluginSettingTab {
	private readonly plugin: BetterMarkdownCommentsPlugin;
	private readonly containerStack: HTMLElement[];
	private example?: HTMLSpanElement;

	constructor(app: App, plugin: BetterMarkdownCommentsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.containerStack = [this.containerEl];
	}

	display(): void {
		this.container.empty();

		this.container.createEl('h2', { text: 'General Settings' });
		this.createGeneralSection();

		this.container.createEl('h2', { text: 'Comment Appearance' });
		this.createExampleSection();
		this.createAppearanceSection();
	}

	/**
	 * The currently active container element in the {@link containerStack}.
	 *
	 * This should be preferred over {@link containerEl} when adding any element
	 * as it will always reflect the active container.
	 */
	private get container(): HTMLElement {
		return this.containerStack[this.containerStack.length - 1];
	}

	private createGeneralSection() {
		this.add(
			['commentStyle'],
			(setting, apply) => {
				const desc = new DocumentFragment();
				desc.appendText('The style of comment to use when toggling.');
				desc.createEl('br');
				desc.createEl('br');
				desc.createEl('span', {
					text: 'Note: ',
					attr: { style: 'font-weight: var(--font-semibold);' },
				});
				desc.appendText('Changing this value will not update existing comments.');

				return setting
					.setName('Comment Style')
					.setDesc(desc)
					.addDropdown((dropdown) => {
						dropdown
							.addOptions({
								html: 'HTML (<!-- -->)',
								obsidian: 'Obsidian (%% %%)',
								custom: 'Custom',
							} as Record<CommentStyle, string>)
							.setValue(this.plugin.settings.commentStyle)
							.onChange(async (value) => {
								this.plugin.settings.commentStyle = value as CommentStyle;
								await apply();
								this.display();
							});
					});
			},
			{ refreshAppearance: false },
		);

		if (this.plugin.settings.commentStyle === 'custom') {
			this.add(
				['customCommentStart', 'customCommentEnd'],
				(setting, apply) => {
					const desc = new DocumentFragment();
					desc.appendText('The start and end tokens used to comment out a line.');
					desc.createEl('br');
					desc.createEl('br');
					desc.createEl('span', {
						text: 'Note: ',
						attr: { style: 'font-weight: var(--font-semibold);' },
					});
					desc.appendText(
						'Custom tokens that would not otherwise render as a valid comment in Markdown can still be used but will not be hidden from reader view.',
					);

					return setting
						.setName('Custom Comment Style')
						.setDesc(desc)
						.addText((text) => {
							text.setPlaceholder('Comment start (e.g. "<!--")')
								.setValue(this.plugin.settings.customCommentStart)
								.onChange(async (value) => {
									this.plugin.settings.customCommentStart = value.trim();
									await apply();
								});
						})
						.addText((text) =>
							text
								.setPlaceholder('Comment end (e.g. "-->")')
								.setValue(this.plugin.settings.customCommentEnd ?? '')
								.onChange(async (value) => {
									this.plugin.settings.customCommentEnd = value.trim();
									await apply();
								}),
						);
				},
				{ refreshAppearance: false },
			);
		}

		this.add(
			['dropCursor'],
			(setting, apply) =>
				setting
					.setName('Drop Cursor')
					.setDesc('Automatically drop the cursor to the next line after toggling a comment.')
					.addToggle((toggle) => {
						toggle.setValue(this.plugin.settings.dropCursor).onChange(async (value) => {
							this.plugin.settings.dropCursor = value;
							await apply();
						});
					}),
			{ refreshAppearance: false },
		);
	}

	private createExampleSection() {
		const exampleCard = this.createCard(() => {
			const exampleContainer = this.container.createDiv({
				cls: 'cm-line',
			});
			this.example = exampleContainer.createEl('span');
			this.updateExample();
		});
		exampleCard.setAttribute('role', 'figure');
		exampleCard.setAttribute('aria-label', 'Example of what a comment will look like.');
	}

	private createAppearanceSection() {
		const { overrideAppearance, appearance } = this.plugin.settings;

		this.add(
			['overrideAppearance'],
			(setting, apply) => {
				const elt = setting
					.setName('Override Appearance')
					.setDesc('Allow this plugin to override the current comment appearance.')
					.addToggle((toggle) => {
						toggle.setValue(overrideAppearance).onChange(async (value) => {
							this.plugin.settings.overrideAppearance = value;
							await apply();
							this.display();
						});
					}).settingEl;

				elt.setCssStyles({
					borderTop: 'none',
				});

				return setting;
			},
			{
				refreshAppearance: false,
				onApply: () => {
					this.plugin.refreshAppearanceOverride();
				},
			},
		);

		this.createSection(() => {
			// Create empty setting to add a border to the section
			const empty = new Setting(this.container).setDisabled(true).settingEl;
			empty.setCssStyles({ padding: '0' });
			empty.toggleAttribute('inert', true);

			this.add(['appearance.color'], (setting, apply) =>
				setting.setName('Comment Color').addColorPicker((picker) => {
					picker.setValue(appearance.color).onChange(async (value) => {
						appearance.color = value;
						await apply();
					});
				}),
			).setDisabled(!overrideAppearance);

			this.add(['appearance.showBackground', 'appearance.backgroundColor'], (setting, apply) =>
				setting
					.setName('Comment Background')
					.addToggle((toggle) => {
						toggle.setValue(appearance.showBackground).onChange(async (value) => {
							appearance.showBackground = value;
							await apply();
						});
					})
					.addColorPicker((picker) => {
						picker.setValue(appearance.backgroundColor).onChange(async (value) => {
							appearance.backgroundColor = value;
							await apply();
						});
					}),
			).setDisabled(!overrideAppearance);

			this.add(['appearance.showOutline', 'appearance.outlineColor'], (setting, apply) =>
				setting
					.setName('Comment Outline')
					.addToggle((toggle) => {
						toggle.setValue(appearance.showOutline).onChange(async (value) => {
							appearance.showOutline = value;
							await apply();
						});
					})
					.addColorPicker((picker) => {
						picker.setValue(appearance.outlineColor).onChange(async (value) => {
							appearance.outlineColor = value;
							await apply();
						});
					}),
			).setDisabled(!overrideAppearance);

			this.add(['appearance.italic'], (setting, apply) =>
				setting.setName('Italicize Comments').addToggle((toggle) => {
					toggle.setValue(appearance.italic).onChange(async (value) => {
						appearance.italic = value;
						await apply();
					});
				}),
			).setDisabled(!overrideAppearance);

			this.add(['appearance.weight'], (setting, apply) =>
				setting.setName('Comment Font Weight').addSlider((slider) => {
					slider
						.setLimits(100, 900, 100)
						.setDynamicTooltip()
						.setValue(appearance.weight)
						.onChange(async (value) => {
							appearance.weight = value;
							await apply();
						});
				}),
			).setDisabled(!overrideAppearance);
		}, overrideAppearance);
	}

	/**
	 * Add a setting to the current {@link container} element.
	 *
	 * This will automatically handle saving the setting and refreshing the appearance.
	 * It will also automatically add a reset button to the setting.
	 *
	 * @param paths The setting path(s) this setting affects.
	 * @param init A function to initialize the setting.
	 * @param options Custom configuration for the setting.
	 */
	private add(
		paths: SettingsPath[],
		init: (setting: Setting, apply: () => Promise<void>) => Setting,
		options: AddSettingOptions = {},
	) {
		const { refreshAppearance = true, onApply } = options;

		const listeners: (() => void)[] = [];

		const setting = init(new Setting(this.container), async () => {
			await this.plugin.saveSettings();
			refreshAppearance && this.plugin.refreshAppearance();
			onApply?.();
			this.updateExample();
			listeners.forEach((cb) => cb());
		});

		setting.addExtraButton((btn) => {
			const component = btn
				.setIcon('reset')
				.setTooltip('Restore default')
				.onClick(async () => {
					restoreSettings(this.plugin.settings, ...paths);
					await this.plugin.saveSettings();
					this.plugin.refreshAppearance();
					this.display();
				});

			const refresh = () => {
				const isDisabled = isDefaultSettings(this.plugin.settings, ...paths);
				component.setDisabled(isDisabled);
				component.extraSettingsEl.style.pointerEvents = isDisabled ? 'none' : 'auto';
				component.extraSettingsEl.style.filter = isDisabled ? 'opacity(0.5)' : 'unset';
				component.extraSettingsEl.setAttribute('aria-disabled', isDisabled.toString());
			};
			listeners.push(refresh);
			refresh();
		});

		return setting;
	}

	/**
	 * Create a card element.
	 */
	private createCard(create: () => void): HTMLDivElement {
		const card = this.container.createDiv();
		card.setCssStyles({
			padding: 'var(--size-4-6) var(--size-4-4)',
			margin: 'var(--size-4-5) 0',
			// backgroundColor: 'var(--background-primary-alt)',
			borderWidth: 'var(--border-width)',
			borderColor: 'var(--background-modifier-border)',
			borderStyle: 'solid',
			borderRadius: 'var(--radius-s)',
		});
		this.containerStack.push(card);
		create();
		this.containerStack.pop();
		return card;
	}

	/**
	 * Create a section element.
	 *
	 * This will automatically handle the styling for disabled sections.
	 */
	private createSection(create: () => void, enabled = true): HTMLDivElement {
		const section = this.container.createDiv();
		section.setCssStyles({
			pointerEvents: enabled ? 'auto' : 'none',
			filter: enabled ? 'unset' : 'opacity(0.35) brightness(0.85)',
		});
		section.setAttribute('aria-disabled', (!enabled).toString());
		section.toggleAttribute('inert', !enabled);

		this.containerStack.push(section);
		create();
		this.containerStack.pop();

		return section;
	}

	/**
	 * Update the example comment with the current settings.
	 */
	private updateExample() {
		if (this.example) {
			this.example.textContent = buildCommentString('This is a comment', this.plugin.settings);
			this.example.addClass('cm-comment');
			this.plugin.settings.overrideAppearance &&
				this.example.setAttr('style', buildStyleString(this.plugin.settings.appearance));
		}
	}
}

interface AddSettingOptions {
	/** Callback for when a setting is applied. */
	onApply?: () => void;
	/**
	 * Whether to refresh the appearance after a setting is applied.
	 *
	 * @default true
	 */
	refreshAppearance?: boolean;
}
