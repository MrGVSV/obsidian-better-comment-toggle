/**
 * A list that can be accessed by index or by key.
 *
 * Item indexes are tracked by a {@link Map}, keyed by the result of {@link toKey}.
 */
export class ListDict<T, K = T> {
	private readonly list: T[];
	private dict: Map<K, number>;

	/**
	 *
	 * @param toKey The function to use to generate the key for an item
	 * @param entries The initial entries to populate the list with
	 */
	constructor(
		private toKey: (item: T) => K,
		entries?: Iterable<T>,
	) {
		this.list = entries ? Array.from(entries) : [];
		this.dict = new Map(this.list.map((item, i) => [toKey(item), i]));
	}

	/**
	 * Create a {@link ListDict} that uses the item itself as the key.
	 */
	public static identity<T extends object>(entries?: Iterable<T>): ListDict<T, T> {
		return new ListDict((item) => item, entries);
	}

	/**
	 * The length of the list.
	 */
	public get length() {
		return this.list.length;
	}

	public [Symbol.iterator]() {
		return this.list[Symbol.iterator]();
	}

	/**
	 * Get the item with the given key.
	 */
	public get(key: K): T | undefined {
		const index = this.dict.get(key);
		return index === undefined ? undefined : this.list[index];
	}

	/**
	 * Get the item at the given index.
	 */
	public at(index: number): T | undefined {
		return this.list[index];
	}

	/**
	 * Get the index of the given item.
	 */
	public indexOf(item: K): number | undefined {
		return this.dict.get(item);
	}

	/**
	 * Push an item to the end of the list.
	 */
	public push(item: T): number {
		const index = this.list.push(item) - 1;
		this.dict.set(this.toKey(item), index);
		return index;
	}

	/**
	 * Remove and return the last item in the list.
	 */
	public pop(): T | undefined {
		const item = this.list.pop();
		if (item) {
			this.dict.delete(this.toKey(item));
		}
		return item;
	}

	/**
	 * Insert an item at the given index.
	 */
	public insert(index: number, item: T): boolean {
		if (index < 0 || index > this.list.length) {
			return false;
		}
		this.list.splice(index, 0, item);
		this.dict.set(this.toKey(item), index);
		this.updateIndexes(index + 1);
		return true;
	}

	/**
	 * Remove the item with the given key.
	 */
	public remove(item: K): boolean {
		const index = this.dict.get(item);
		if (index === undefined) {
			return false;
		}
		this.list.splice(index, 1);
		this.dict.delete(item);
		this.updateIndexes(index);

		return true;
	}

	/**
	 * Remove the item at the given index.
	 */
	public removeAt(index: number): boolean {
		const item = this.list[index];
		if (item === undefined) {
			return false;
		}
		this.list.splice(index, 1);
		this.dict.delete(this.toKey(item));
		return true;
	}

	/**
	 * Swap the positions of two items.
	 *
	 * @param itemA The key of the first item
	 * @param itemB The key of the second item
	 */
	public swap(itemA: K, itemB: K): boolean {
		const indexA = this.dict.get(itemA);
		const indexB = this.dict.get(itemB);
		if (indexA === undefined || indexB === undefined) {
			return false;
		}
		return this.swapAt(indexA, indexB);
	}

	/**
	 * Swap the positions of two items.
	 *
	 * @param indexA The index of the first item
	 * @param indexB The index of the second item
	 */
	public swapAt(indexA: number, indexB: number): boolean {
		const itemA = this.list[indexA];
		const itemB = this.list[indexB];
		if (itemA === undefined || itemB === undefined) {
			return false;
		}

		this.list[indexA] = itemB;
		this.list[indexB] = itemA;
		this.dict.set(this.toKey(itemA), indexB);
		this.dict.set(this.toKey(itemB), indexA);
		return true;
	}

	/**
	 * Remove all items from the list.
	 */
	public clear(): number {
		const length = this.list.length;
		this.list.length = 0;
		this.dict.clear();
		return length;
	}

	/**
	 * Create a new array populated with the results of calling a provided function
	 * on every element in the list.
	 */
	public map<U>(mapper: (value: T, index: number, array: T[]) => U, thisArg?: any): U[] {
		return this.list.map(mapper, thisArg);
	}

	/**
	 * Update all the mapped indexes after the given index.
	 */
	private updateIndexes(startIndex = 0) {
		for (let i = startIndex; i < this.length; i++) {
			const item = this.at(i);
			if (item === undefined) {
				continue;
			}
			this.dict.set(this.toKey(item), i);
		}
	}
}
