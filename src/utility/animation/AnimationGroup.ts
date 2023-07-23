/**
 * A group of animations to play at the same time.
 */
export class AnimationGroup {
	private readonly keyframes: KeyframeEffect[];
	private readonly longestKeyframe: KeyframeEffect | undefined;

	constructor(...effects: KeyframeEffect[]) {
		this.keyframes = Array(effects.length);
		let maxDuration = -Infinity;

		for (const effect of effects) {
			const duration = Number(effect.getTiming().duration) ?? 0;
			if (duration > maxDuration) {
				this.longestKeyframe = effect;
				maxDuration = duration;
			}

			this.keyframes.push(effect);
		}
	}

	/**
	 * Plays all animations in the group.
	 * @param callback A callback that is called when the longest animation finishes.
	 */
	public play(callback: ((this: Animation, ev: AnimationPlaybackEvent) => any) | null = null) {
		const isReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
		for (const keyframe of this.keyframes) {
			const animation = new Animation(keyframe);
			if (this.longestKeyframe === keyframe) {
				animation.onfinish = callback;
			}

			if (isReducedMotion) {
				animation.finish();
			} else {
				animation.play();
			}
		}
	}
}
