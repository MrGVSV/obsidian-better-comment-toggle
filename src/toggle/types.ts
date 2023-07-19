export interface LineState {
	/**
	 * Whether the line is commented or not.
	 */
	isCommented: boolean;
	/**
	 * The uncommented portion of the line.
	 */
	text: string;
}

/**
 * The various comment states that a range of lines can be in.
 */
export type RangeState = 'uncommented' | 'commented' | 'mixed';

export interface ToggleResult {
	before: LineState;
	after: LineState;
	/**
	 * The tokens used to comment the line (start).
	 */
	commentStart: string;
	/**
	 * The tokens used to comment the line (end).
	 */
	commentEnd: string;
}
