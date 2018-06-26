class Player {

	constructor () {
		this.videos = Array.from(document.querySelectorAll('.c-card-media'));

		this.playerHolder = document.querySelector('.media-player-holder');
		this.player = document.querySelector('.media-player');
		this.playerClose = document.querySelector('.media-player .bttn-close');

		this.getFirstBCR = this.getFirstBCR.bind(this);
		this.getLastBCR  = this.getLastBCR.bind(this);
		this.invert      = this.invert.bind(this);
		this.play        = this.play.bind(this);
		this.flip        = this.flip.bind(this);
		this.flipIn      = this.flipIn.bind(this);
		this.flipOut     = this.flipOut.bind(this);
		this.flipPlayer  = this.flipPlayer.bind(this);

		this.addEventListeners();
	}

	addEventListeners () {
		this.videos.forEach((video) => {
			video.addEventListener('click', evt => {
				this.target = evt.target;

				this.flipPlayer();				
			});
		});

		this.player.addEventListener('click', evt => {
			const targetIndex = this.videos.indexOf(this.target);

			const onFlipEnd = evt => {
				this.player.classList.remove('is-animating');

				this.player.removeEventListener('transitionend', onFlipEnd);
			}

			this.firstBCR = this.player.getBoundingClientRect();

			this.player.classList.remove('is-opened');

			this.lastBCR = this.player.getBoundingClientRect();
			this.player.style.transform = `translateY(${(180 * targetIndex)}px)`;
			this.lastBCR = this.player.getBoundingClientRect();

			const scaleRatio = Math.abs(( this.lastBCR.width ) / this.firstBCR.width);
			const translateX = Math.ceil(((this.lastBCR.width - this.firstBCR.width) / 2));
			const translateY = Math.ceil((((this.firstBCR.height - this.lastBCR.height) / 2)) + (180 * targetIndex));

			this.player.style.transform  = `translate(0,${(180 * targetIndex)}px)`;
			this.lastBCR = this.target.getBoundingClientRect();

			this.player.classList.add('is-animating');

			this.player.style.willChange = 'transform';
			this.player.style.transform  = 'none';

			movie.scroller.classList.remove('is-faded-out');

			movie.sidebarR.style.willChange = 'initial';
			movie.sidebarR.style.transform = 'none';

			this.player.addEventListener('transitionend', onFlipEnd);
		});
	}

	flip () {
		if (this.target.classList.contains('is-opened')) {
			this.flipOut();
			return;
		}

		this.flipIn();
	}

	flipIn () {
		const targetIndex = this.videos.indexOf(this.target);

		const onFlipEnd = evt => {
			this.target.classList.remove('is-animating');
			this.target.style.zIndex = '0';

			this.target.removeEventListener('transitionend', onFlipEnd);
		};

		this.target.style.zIndex = '1';

		this.getFirstBCR();
		
		this.target.classList.add('is-opened');

		this.getLastBCR();
		this.invert();

		this.target.classList.add('is-animating');

		this.play();

		this.target.addEventListener('transitionend', onFlipEnd);
	}

	flipOut () {
		const targetIndex = this.videos.indexOf(this.target);
		
		const onFlipEnd = evt => {
			this.target.style.zIndex = '0';
			// this.target.classList.remove('is-animating');

			this.target.removeEventListener('transitionend', onFlipEnd);
		};

		this.getFirstBCR();

		this.target.classList.remove('is-opened');

		this.getLastBCR();
		this.invert();

		// this.target.classList.add('is-animating');

		this.play();

		this.target.style.zIndex = '0';

		this.target.addEventListener('transitionend', onFlipEnd);
	}

	flipPlayer () {
		const targetIndex = this.videos.indexOf(this.target);

		const onFlipEnd = evt => {
			this.player.classList.remove('is-animating');

			this.player.removeEventListener('transitionend', onFlipEnd);
		}

		if (this.player.classList.contains('is-opened')) {		
			return;
		}

		movie.scroller.classList.add('is-faded-out');

		// Hide media sidebar.
		movie.sidebarR.style.willChange = 'transform';
		movie.sidebarR.style.transform = 'translateX(100%)';
		movie.sidebarR.style.transition = 'transform .15s cubic-bezier(0.4, 0.0, 0.2, 1)';

		this.player.style.transform = `translateY(${180 * targetIndex}px)`;
		this.firstBCR = this.player.getBoundingClientRect();

		this.player.classList.add('is-opened');

		this.lastBCR = this.player.getBoundingClientRect();
		this.player.style.transform = `translateY(-${((this.lastBCR.top - 24) - (180 * targetIndex)) - 64}px)`;
		this.lastBCR = this.player.getBoundingClientRect();

		const padding = 24;
		const scaleRatio = Math.abs(( this.firstBCR.width ) / this.lastBCR.width);
		const translateX = Math.ceil(((this.lastBCR.width - this.firstBCR.width) / 2) + padding);
		const translateY = Math.ceil((((this.firstBCR.height - this.lastBCR.height) / 2) - padding) + (180 * targetIndex));

		this.player.style.transform = `translate(${translateX}px,${translateY}px) scale(${scaleRatio})`;
		this.lastBCR = this.target.getBoundingClientRect();

		this.player.classList.add('is-animating');

		this.player.style.willChange = 'transform';
		this.player.style.transform  = 'none';

		this.player.addEventListener('transitionend', onFlipEnd);
	}

	getFirstBCR () {
		this.firstBCR = this.target.getBoundingClientRect();
		console.log('firstBCR',this.firstBCR);
	}

	getLastBCR () {
		this.lastBCR = this.target.getBoundingClientRect();
		console.log('lastBCR',this.lastBCR);
	}

	invert () {
		const padding = 24;
		const scaleRatio = Math.abs(( this.firstBCR.width ) / this.lastBCR.width);
		const translateX = Math.ceil(((this.lastBCR.width - this.firstBCR.width)) + padding);
		const translateY = Math.ceil(((this.firstBCR.top - this.lastBCR.top)) - padding);

		this.target.style.transform  = `translate(${translateX}px,${translateY}px) scale(${scaleRatio})`;
	}

	play () {
		this.target.style.willChange = 'transform';
		this.target.style.transform  = 'none';
	}
	
}

new Player();