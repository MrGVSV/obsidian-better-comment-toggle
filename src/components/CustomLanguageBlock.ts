import { setIcon } from 'obsidian';
import styles from './CustomLanguageBlock.module.scss';
import { Foldout } from './Foldout';
import { TextInput } from './TextInput';
import { CustomLanguage } from '../settings/types';
import { emptyLang } from '../settings/defaults';
import { IconButton } from './IconButton';
import { BaseComponent } from './BaseComponent';

/**
 * Component for a single custom language block.
 */
export class CustomLanguageBlock extends BaseComponent {
	private lang: CustomLanguage;
	private regexEl: HTMLElement;
	private sampleEl: HTMLElement;
	private upBtnComponent: IconButton;
	private downBtnComponent: IconButton;
	private deleteBtnComponent: IconButton;
	private addBtnComponents: IconButton[];
	private regexInputComponent: TextInput;
	private startInputComponent: TextInput;
	private endInputComponent: TextInput;

	protected init(container: HTMLElement): HTMLElement {
		this.lang = emptyLang();

		const block = container.createDiv(styles.container);

		new Foldout(block)
			.setSummary(() => {
				const frag = new DocumentFragment();

				const summary = frag.createEl('figure', styles.summarySection);

				const regexContainer = summary.createEl('figcaption', styles.regex);
				const icon = regexContainer.createDiv(styles.regexIcon);
				setIcon(icon, 'regex');
				icon.role = 'img';

				this.regexEl = regexContainer.createDiv(styles.regexText);

				this.sampleEl = summary.createSpan({
					cls: [styles.sample, styles.code, styles.comment],
				});

				return frag;
			})
			.addChild(() => {
				const frag = new DocumentFragment();

				const content = frag.createDiv(styles.fields);

				this.regexInputComponent = new TextInput(content).setName('Regex').setPlaceholder('lang');
				this.regexInputComponent.inputEl.addClass(styles.field);
				this.startInputComponent = new TextInput(content).setName('Comment Start').setPlaceholder('<!--');
				this.startInputComponent.inputEl.addClass(styles.field);
				this.endInputComponent = new TextInput(content).setName('Comment End').setPlaceholder('-->');
				this.endInputComponent.inputEl.addClass(styles.field);

				return frag;
			})
			.rootEl.addClass(styles.foldout);

		const buttons = block.createDiv(styles.buttons);

		this.upBtnComponent = new IconButton(buttons).setIcon('chevron-up').setTooltip('Shift up');
		this.upBtnComponent.extraSettingsEl.addClass(styles.controlButton);

		this.downBtnComponent = new IconButton(buttons).setIcon('chevron-down').setTooltip('Shift down');
		this.downBtnComponent.extraSettingsEl.addClass(styles.controlButton);

		this.deleteBtnComponent = new IconButton(buttons).setIcon('x').setTooltip('Delete');
		this.deleteBtnComponent.extraSettingsEl.addClass(styles.controlButton);

		this.addBtnComponents = [];

		const mobileAddBtn = new IconButton(buttons).setIcon('plus').setTooltip('Insert');
		mobileAddBtn.extraSettingsEl.addClass(styles.addButton, styles.controlButton, styles.mobileAdd);

		const normalAddBtn = new IconButton(block).setIcon('plus').setTooltip('Insert');
		normalAddBtn.extraSettingsEl.addClass(styles.addButton);

		this.addBtnComponents = [mobileAddBtn, normalAddBtn];

		return block;
	}

	public setLang(lang: CustomLanguage): this {
		this.lang = lang;

		const { regex, commentStart, commentEnd } = lang;

		this.regexInputComponent.setValue(regex);
		this.regexEl.setText(regex);

		this.startInputComponent.setValue(commentStart);
		this.endInputComponent.setValue(commentEnd);

		this.sampleEl.setText(`${commentStart} This is a comment ${commentEnd}`);
		return this;
	}

	public onChange(callback: (lang: CustomLanguage, self: this) => any): this {
		this.regexInputComponent.onChange((value) => {
			this.lang.regex = value.trim();
			this.setLang(this.lang);
			callback(this.lang, this);
		});

		this.startInputComponent.onChange((value) => {
			this.lang.commentStart = value.trim();
			this.setLang(this.lang);
			callback(this.lang, this);
		});

		this.endInputComponent.onChange((value) => {
			this.lang.commentEnd = value.trim();
			this.setLang(this.lang);
			callback(this.lang, this);
		});

		return this;
	}

	public onShiftUp(callback: (self: this) => any): this {
		this.upBtnComponent.onClick(() => callback(this));
		return this;
	}

	public onShiftDown(callback: (self: this) => any): this {
		this.downBtnComponent.onClick(() => callback(this));
		return this;
	}

	public onDelete(callback: (self: this) => any): this {
		this.deleteBtnComponent.onClick(() => callback(this));
		return this;
	}

	public onAdd(callback: (self: this) => any): this {
		for (const component of this.addBtnComponents) {
			component.onClick(() => callback(this));
		}
		return this;
	}

	public setShiftUpDisabled(disabled: boolean): this {
		this.upBtnComponent.setDisabled(disabled);
		return this;
	}

	public setShiftDownDisabled(disabled: boolean): this {
		this.downBtnComponent.setDisabled(disabled);
		return this;
	}

	public setDeleteDisabled(disabled: boolean): this {
		this.deleteBtnComponent.setDisabled(disabled);
		return this;
	}

	public setAddButtonHidden(hidden: boolean): this {
		for (const component of this.addBtnComponents) {
			component.extraSettingsEl.toggleAttribute('disabled', hidden);
			component.extraSettingsEl.toggleClass(styles.addButtonHidden, hidden);
		}
		return this;
	}
}
