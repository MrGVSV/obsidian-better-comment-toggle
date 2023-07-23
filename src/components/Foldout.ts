import styles from './Foldout.module.scss';
import { BaseComponent } from './BaseComponent';

/**
 * A component used for creating foldable regions.
 *
 * Under the hood, this just uses a stylized `<details>` element.
 */
export class Foldout extends BaseComponent {
	public summaryEl: HTMLElement;
	public contentEl: HTMLElement;

	protected init(container: HTMLElement): HTMLElement {
		const root = container.createEl('details', styles.foldout);
		this.summaryEl = root.createEl('summary', styles.summary);
		this.contentEl = root.createDiv(styles.content);
		return root;
	}

	public setSummary(summary: string | HTMLElement | DocumentFragment | (() => DocumentFragment)): this {
		if (typeof summary === 'string') {
			this.summaryEl.append(summary);
			return this;
		}

		this.summaryEl.append(typeof summary === 'function' ? summary() : summary);
		return this;
	}

	public addChild(child: HTMLElement | DocumentFragment | (() => DocumentFragment)): this {
		this.contentEl.appendChild(typeof child === 'function' ? child() : child);
		return this;
	}
}
