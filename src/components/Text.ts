import { BaseComponent } from './BaseComponent';

type TextVariant = 'setting-item-name' | 'setting-item-description';
type TextInput = string | ((frag: DocumentFragment) => DocumentFragment);

/**
 * Component for displaying text.
 */
export class Text extends BaseComponent {
	constructor(
		container: HTMLElement,
		text: TextInput = '',
		private variant: TextVariant = 'setting-item-description',
	) {
		super(container);

		this.setText(text);
		this.setVariant(variant);
	}

	protected init(container: HTMLElement): HTMLElement {
		return container.createDiv();
	}

	public setText(text: TextInput): this {
		this.rootEl.setText(computeText(text));
		return this;
	}

	public setVariant(variant: TextVariant): this {
		this.rootEl.removeClass(this.variant);
		this.variant = variant;
		this.rootEl.addClass(variant);
		return this;
	}
}

function computeText(text: TextInput) {
	return typeof text === 'function' ? text(new DocumentFragment()) : text;
}
