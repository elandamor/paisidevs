class Navigator {
	constructor () {
		this.body   = document.body;
		this.el     = document.getElementById('muvizone-app');
		this.handle = this.el.querySelector('.l-movies-list');

		this.sections            = [].slice.call(this.handle.children);
		this.sectionsCount       = this.sections.length;

		this.navDots          = this.el.querySelector('.nav-dots');
		this.navDotsLinks     = [].slice.call( this.navDots.children );

		this.navArrows    = [].slice.call(this.el.querySelector('.nav-arrows').children);
		this.navArrowUp   = this.navArrows[0];
		this.navArrowDown = this.navArrows[1];

		this.art = [].slice.call( this.el.querySelector('.l-movie-art').children );

		this.onTransitionEnd = this.onTransitionEnd.bind(this);
		this.navigate        = this.navigate.bind(this);
		this.getIndex        = this.getIndex.bind(this);
		
		this.currentIndex = 0;
		this.oldIndex = this.currentIndex;
		this.newIndex = null;

		this.art[this.currentIndex].classList.add('is-visible');
		this.sections[this.currentIndex].classList.add('is-visible');
		this.navDotsLinks[this.currentIndex].classList.add('is-active');

		this.navigate();

		this.addEventListeners();
	}

	addEventListeners () {
		this.navDotsLinks.forEach((dot,idx) => {
			dot.addEventListener('click', evt => {
				evt.preventDefault();

				this.oldIndex = this.currentIndex;

				if (idx !== this.currentIndex) {
					requestAnimationFrame(this.navigate);

					this.currentIndex = idx;
					this.newIndex = this.currentIndex;
				}
			});
		});

		this.navArrowUp.addEventListener('click', evt => {
			this.oldIndex = this.currentIndex;

			this.currentIndex -= 1;

			if (this.currentIndex < 0) {
				this.currentIndex = this.oldIndex;
				return;
			}

			requestAnimationFrame(this.navigate);
			this.newIndex = this.currentIndex;
		});

		this.navArrowDown.addEventListener('click', evt => {
			this.oldIndex = this.currentIndex;

			this.currentIndex += 1;

			if (this.currentIndex > (this.sections.length - 1)) {
				this.currentIndex = this.oldIndex;
				return;
			}

			requestAnimationFrame(this.navigate);
			this.newIndex = this.currentIndex;
		});

		document.addEventListener('keydown', (ev) => {
			let keyCode = ev.keyCode || ev.which;
			const UP = 38, DOWN = 40;

			this.oldIndex = this.currentIndex;

			if (this.body.classList.contains('detail-view'))
				return;

			if (keyCode == UP) {
				this.currentIndex -= 1;

				if (this.currentIndex < 0) {
					this.currentIndex = this.oldIndex;
					return;
				}

				requestAnimationFrame(this.navigate);
				this.newIndex = this.currentIndex;
			}

			if (keyCode == DOWN) {
				this.currentIndex += 1;

				if (this.currentIndex > (this.sections.length - 1)) {
					this.currentIndex = this.oldIndex;
					return;
				}

				requestAnimationFrame(this.navigate);
				this.newIndex = this.currentIndex;
			}
		}); 
	}

	getIndex () {
		return this.currentIndex;
	}

	navigate () {
		const translateY = -(this.currentIndex * 100);
		this.handle.style.transform = `translateY(${translateY}vh)`;

		// manage section transitions
		this.sections[this.oldIndex].classList.remove('is-visible');
		this.sections[this.currentIndex].classList.add('is-visible');

		// manage background art transitions.
		this.art[this.oldIndex].classList.remove('is-visible');
		this.art[this.currentIndex].classList.add('is-visible');

		// manage nav dots transitions.
		this.navDotsLinks.forEach( (dot) => {
			dot.classList.remove('is-active');
		});

		this.navDotsLinks[this.currentIndex].classList.add('is-active');

		this.handle.addEventListener('transitionend', this.onTransitionEnd);
	}

	onTransitionEnd (evt) {
		if (this.currentIndex < 1) {
			this.navArrowUp.classList.add('is-faded-out--mid');
		} else if (this.currentIndex > 0) {
			this.navArrowUp.classList.remove('is-faded-out--mid');
		}

		if (this.currentIndex > (this.sections.length - 2)) {
			this.navArrowDown.classList.add('is-faded-out--mid');
		} else if (this.currentIndex < (this.sections.length - 1)) {
			this.navArrowDown.classList.remove('is-faded-out--mid');
		}

		this.handle.removeEventListener('transitionend', this.onTransitionEnd);
	}
}

let navigate = new Navigator();
