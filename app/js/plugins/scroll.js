'use strict';

class Scroll {

	constructor () {
		this._lastScrollY = 0;
		this._scrolling = false;
		this._rAFrame = undefined;
	}

	_updateScroll (evt) {
		this._scrolling = false;

		const this._curScrollY = this._lastScrollY;
	}

	_requestScroll (evt) {
		if (this._scrolling) {
			return;
		}

		this._scrolling = true;
		requestAnimationFrame(this._updateScroll);
	}

	_onScroll (evt) {
		this._lastScrollY = window.scrollY;

		this._requestScroll();
	}

	_scrollTo (pos,dest,dur,curve) {
		const NOW = () => {
			return new Date().getTime();
		};

		const self = window;

		const startTime = NOW(),
		    deltaPos = dest - pos,
		    destTime = startTime + dur,
		    percentageTime = undefined,
		    percentageProgress = undefined,
		    newPos = undefined;

		const step = () => {
			const now = NOW();

			if (now >= destTime) {
				self.scrollTo(0,dest);
				return; // done
			}

			percentageTime = (now - startTime) / dur;
			percentageProgress = curve(percentageTime);

			newPos = deltaPos * percentageProgress + pos;

			self.scrollTo(0, newPos);

			this._rAFrame = requestAnimationFrame(step);
		}

		step();
	}

}

new Scroll();