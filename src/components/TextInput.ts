import { AbstractTextComponent, TextComponent } from 'obsidian';
import styles from './TextInput.module.scss';
import { nanoid } from 'nanoid';
import { BaseComponent } from './BaseComponent';

export class TextInput extends BaseComponent implements AbstractTextComponent<HTMLInputElement> {
	public nameEl: HTMLElement;
	public textComponent: TextComponent;

	protected init(container: HTMLElement): HTMLElement {
		const root = container.createDiv(styles.container);

		const id = nanoid();
		this.nameEl = root.createEl('label', { cls: styles.name, attr: { for: id } });

		this.textComponent = new TextComponent(root);
		this.textComponent.inputEl.id = id;

		return root;
	}

	public get disabled(): boolean {
		return this.textComponent.disabled;
	}

	public get inputEl(): HTMLInputElement {
		return this.textComponent.inputEl;
	}

	public setName(name: string): this {
		this.nameEl.setText(name);
		return this;
	}

	public getValue(): string {
		return this.textComponent.getValue();
	}

	public onChange(callback: (value: string) => any): this {
		this.textComponent.onChange(callback);
		return this;
	}

	public onChanged(): void {
		this.textComponent.onChanged();
	}

	public registerOptionListener(listeners: Record<string, (value?: string) => string>, key: string): this {
		this.textComponent.registerOptionListener(listeners, key);
		return this;
	}

	public setDisabled(disabled: boolean): this {
		this.textComponent.setDisabled(disabled);
		return this;
	}

	public setPlaceholder(placeholder: string): this {
		this.textComponent.setPlaceholder(placeholder);
		return this;
	}

	public setValue(value: string): this {
		this.textComponent.setValue(value);
		return this;
	}

	public then(cb: (component: this) => any): this {
		cb(this);
		return this;
	}
}
