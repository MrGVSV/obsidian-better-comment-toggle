import { ExtraButtonComponent } from 'obsidian';
import styles from './IconButton.module.scss';

/**
 * Wrapper component around {@link ExtraButtonComponent} that improves accessibility
 * and resolves a few other issues.
 */
export class IconButton extends ExtraButtonComponent {
	constructor(containerEl: HTMLElement) {
		super(containerEl);

		this.extraSettingsEl.role = 'button';
		this.extraSettingsEl.tabIndex = 0;
		this.extraSettingsEl.addClass(styles.btn);

		this.extraSettingsEl.addEventListener('keypress', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				this.extraSettingsEl.click();
			}
		});
	}

	public override setDisabled(disabled: boolean): this {
		this.extraSettingsEl.toggleClass(styles.disabled, disabled);
		this.extraSettingsEl.setAttr('aria-disabled', disabled);
		return super.setDisabled(disabled);
	}
}
