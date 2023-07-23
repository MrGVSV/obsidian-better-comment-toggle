import styles from './CustomLanguageList.module.scss';
import { CustomLanguage } from '../settings/types';
import { CustomLanguageBlock } from './CustomLanguageBlock';
import { BaseComponent } from './BaseComponent';
import { AnimationGroup, AnimationOptions, ListDict } from '../utility';
import { emptyLang } from '../settings/defaults';

interface LangItem {
	el: HTMLElement;
	block: CustomLanguageBlock;
	lang: CustomLanguage;
}

/**
 * Component for a list of {@link CustomLanguageBlock} items.
 */
export class CustomLanguageList extends BaseComponent {
	private items: ListDict<LangItem, HTMLElement>;
	private onChangeCallback: (languages: CustomLanguage[]) => any = () => {};

	protected init(container: HTMLElement): HTMLElement {
		const root = container.createEl('ol', styles.list);
		this.items = new ListDict((item) => item.el);
		return root;
	}

	public languages(): CustomLanguage[] {
		return this.items.map((item) => item.lang);
	}

	public setLanguages(languages: CustomLanguage[]): this {
		this.items.clear();

		for (const lang of languages) {
			this.pushLang(lang);
		}

		return this;
	}

	public onChange(callback: (languages: CustomLanguage[]) => any): this {
		this.onChangeCallback = callback;

		return this;
	}

	public pushLang(lang: CustomLanguage): this {
		this.insert(this.items.length, lang);
		return this;
	}

	/**
	 * Create and insert a new language block at the given index.
	 *
	 * @param index The index to insert the new block at.
	 * If undefined, the block will be inserted at the end of the list.
	 * @param language The language of the block.
	 * If undefined, sets the block to an empty language.
	 */
	private insert(index?: number, language?: CustomLanguage) {
		index = index ?? this.items.length;

		// === Create === //
		const el = this.rootEl.createEl('li', styles.item);
		const lang = language ?? emptyLang();
		const block = new CustomLanguageBlock(el)
			.setLang(lang)
			.onChange((lang, self) => {
				self.setLang(lang);
				this.onChangeCallback(this.languages());
			})
			.onAdd(() => {
				const index = this.items.indexOf(el);
				if (index === undefined) {
					return;
				}

				this.insert(index + 1);
				this.onChangeCallback(this.languages());
			})
			.onShiftUp(() => {
				this.shift(el, 'up');
				this.onChangeCallback(this.languages());
			})
			.onShiftDown(() => {
				this.shift(el, 'down');
				this.onChangeCallback(this.languages());
			})
			.onDelete(() => {
				this.remove(el);
				this.onChangeCallback(this.languages());
			});

		const item: LangItem = { el, block, lang: lang };

		// === Reposition === //
		if (this.rootEl.childNodes.length > 0 && index > 0) {
			const curr = this.rootEl.childNodes.item(index);
			curr.before(item.el);
		}

		// === Insert === //
		this.items.insert(index, item);
		this.refreshIndexes(index - 1, index, index + 1);

		// === Animate === //
		new AnimationGroup(
			new KeyframeEffect(
				item.el,
				[
					{
						// from
						opacity: '0',
						height: '0',
						transform: 'scaleY(0)',
					},
					{
						// to
						opacity: '1',
						height: `${item.el.clientHeight}px`,
						transform: 'scaleY(1)',
					},
				],
				AnimationOptions.fasterEaseOut,
			),
		).play();
	}

	private remove(item: HTMLLIElement) {
		const index = this.items.indexOf(item);
		if (index === undefined) {
			return;
		}

		this.items.remove(item);

		// Removing the first or last item requires that the new first/last item(s) are refreshed
		this.refreshFirstAndLast();

		// Animate after changes have been applied
		new AnimationGroup(
			new KeyframeEffect(
				item,
				[
					{
						// from
						opacity: '1',
						height: `${item.clientHeight}px`,
						transform: 'scaleY(1)',
					},
					{
						// to
						opacity: '0',
						height: '0',
						transform: 'scaleY(0)',
					},
				],
				AnimationOptions.fasterEaseOut,
			),
		).play(() => {
			item.remove();
		});
	}

	private shift(el: HTMLLIElement, direction: 'up' | 'down') {
		const index = this.items.indexOf(el);

		if (
			index === undefined ||
			(index === 0 && direction === 'up') ||
			(index === this.items.length - 1 && direction === 'down')
		) {
			return;
		}

		const offset = direction === 'up' ? -1 : 1;
		const item = this.items.at(index)!;
		const sibling = this.items.at(index + offset)!;

		const [first, second] = direction === 'up' ? [item, sibling] : [sibling, item];
		this.items.swap(first.el, second.el);
		this.refreshItems(first.el, second.el);

		// Animate after changes have been applied
		new AnimationGroup(
			new KeyframeEffect(
				first.el,
				[
					{
						// from
						transform: 'translateY(0)',
					},
					{
						// to
						transform: `translateY(-${second.el.offsetHeight}px)`,
					},
				],
				AnimationOptions.fastEaseOut,
			),
			new KeyframeEffect(
				second.el,
				[
					{
						// from
						transform: 'translateY(0)',
					},
					{
						// to
						transform: `translateY(${first.el.offsetHeight}px)`,
					},
				],
				AnimationOptions.fastEaseOut,
			),
		).play(() => {
			const active = this.rootEl.doc.activeElement as HTMLElement | SVGElement;
			// Swap the elements in the DOM
			this.rootEl.insertBefore(first.el, second.el);
			// Refocus the active element
			active.focus();
		});
	}

	/**
	 * Refresh the first and last list items.
	 *
	 * This will update the rendered state of the items in the DOM.
	 *
	 * This is a convenience around {@link refreshIndexes} to be used whenever
	 * only the first and last items need to be refreshed.
	 */
	private refreshFirstAndLast() {
		if (this.items.length === 0) {
			return;
		}

		this.refreshItems(this.items.at(0)!.el);

		if (this.items.length === 1) {
			return;
		}

		this.refreshItems(this.items.at(this.items.length - 1)!.el);
	}

	/**
	 * Refresh the given list items.
	 *
	 * This will update the rendered state of the items in the DOM.
	 */
	private refreshItems(...els: HTMLElement[]) {
		for (const el of els) {
			const index = this.items.indexOf(el);
			if (index === undefined) {
				continue;
			}

			this.refreshIndexes(index);
		}
	}

	/**
	 * Refresh the list items at the given indexes.
	 *
	 * This will update the rendered state of the items in the DOM.
	 */
	private refreshIndexes(...indexes: number[]) {
		for (const index of indexes) {
			if (index < 0 || index >= this.items.length) {
				continue;
			}

			const item = this.items.at(index);
			if (item === undefined) {
				continue;
			}

			const { block } = item;
			block.setShiftUpDisabled(index === 0);
			block.setShiftDownDisabled(index === this.items.length - 1);
			block.setAddButtonHidden(index === this.items.length - 1);
		}
	}
}
