export abstract class BaseComponent {
	public rootEl: HTMLElement;

	public constructor(container: HTMLElement) {
		this.rootEl = this.init(container);
	}

	/**
	 * Initialize the component.
	 * @returns The root element of the component.
	 */
	protected abstract init(container: HTMLElement): HTMLElement;

	/**
	 * Add one or more classes to the root element of this component.
	 * @param cls
	 */
	public addClass(...cls: string[]): this {
		this.rootEl.addClass(...cls);
		return this;
	}
}
