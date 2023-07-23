/**
 * Standard options for animations.
 */
export const AnimationOptions = {
	get fastEaseOut() {
		return {
			duration: 150,
			easing: 'ease-out',
		};
	},
	get fasterEaseOut() {
		return {
			duration: 50,
			easing: 'ease-out',
		};
	},
	get debugEaseOut() {
		return {
			duration: 2500,
			easing: 'ease-out',
		};
	},
} as const satisfies Record<string, KeyframeEffectOptions>;
