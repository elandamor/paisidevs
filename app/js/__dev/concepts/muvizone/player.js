class Player {

	constructor () {
		this.videos = Array.from(document.querySelectorAll('.c-card-media'));

		this.playerHolder = document.querySelector('.media-player-holder');
		this.player = document.querySelector('.media-player');
		this.drawer = document.querySelector('.l-media-drawer');

		this.getFirstBCR = this.getFirstBCR.bind(this);
		this.getLastBCR  = this.getLastBCR.bind(this);
		this.invert      = this.invert.bind(this);
		this.play        = this.play.bind(this);
		this.flipIn      = this.flipIn.bind(this);
		this.flipOut     = this.flipOut.bind(this);

		this.addEventListeners();
	}

	addEventListeners () {
		this.videos.forEach( video => {
			video.addEventListener('click', evt => {
				this.target = evt.target;

				this.flipIn();				
			});
		});

		this.player.addEventListener('click', evt => {
			this.flipOut();
		});
	}

	flipIn () {
		const targetIndex = this.videos.indexOf(this.target);
		this.targetBCR = this.videos[targetIndex].getBoundingClientRect();

		console.log('target', this.targetBCR);

		const onFlipEnd = evt => {
			this.player.classList.remove('is-animating');

			this.player.removeEventListener('transitionend', onFlipEnd);
		}

		if (this.player.classList.contains('is-opened')) {		
			return;
		}

		movie.content.classList.add('is-faded-out');

		// Hide media sidebar.
		movie.sidebarR.style.willChange = 'transform';
		movie.sidebarR.style.transform = 'translateX(100%)';
		movie.sidebarR.style.transition = 'transform .15s cubic-bezier(0.4, 0.0, 0.2, 1)';

		this.player.style.transform = `translateY(${this.targetBCR.top - 64}px)`;
		this.getFirstBCR(this.player);

		this.player.classList.add('is-opened');

		this.getLastBCR(this.player);
		this.player.style.transform = `translateY(0px)`;
		this.getLastBCR(this.player);

		const padding = 24;
		const scaleRatio = Math.abs(( this.firstBCR.width ) / this.lastBCR.width);
		const translateX = Math.ceil(((this.lastBCR.width - this.firstBCR.width) / 2) + padding * 2 + 64 );
		const translateY = Math.ceil((((this.firstBCR.height - this.lastBCR.height) / 2) - padding) + (this.targetBCR.top - 64));

		this.player.style.transform = `translate(${translateX}px,${translateY}px) scale(${scaleRatio})`;
		this.getLastBCR(this.player);

		this.player.classList.add('is-animating');
		this.drawer.classList.add('is-visible');

		this.play(this.player);

		this.player.addEventListener('transitionend', onFlipEnd);
	}

	flipOut () {
		const onFlipEnd = evt => {
			this.player.classList.remove('is-animating');
			this.player.classList.remove('is-opened');

			this.player.removeEventListener('transitionend', onFlipEnd);
		}

		this.getFirstBCR(this.player);

		const translateX = Math.ceil((this.firstBCR.width - this.targetBCR.width) / 2);
		const translateY = Math.ceil(this.targetBCR.top - (this.targetBCR.height + (64 * 2) + 12));

		this.player.classList.add('is-animating');
		this.player.style.transform  = `translate(${435}px,${translateY}px) scale(0)`;
		this.getLastBCR(this.player);

		this.drawer.classList.remove('is-visible');

		movie.content.classList.remove('is-faded-out');
		movie.sidebarR.style.willChange = 'initial';
		movie.sidebarR.style.transform  = 'none';

		this.player.addEventListener('transitionend', onFlipEnd);
	}

	getFirstBCR (target) {
		this.firstBCR = target.getBoundingClientRect();
		console.log('firstBCR',this.firstBCR);
	}

	getLastBCR (target) {
		this.lastBCR = target.getBoundingClientRect();
		console.log('lastBCR',this.lastBCR);
	}

	invert () {
		const padding = 24;
		const scaleRatio = Math.abs(( this.firstBCR.width ) / this.lastBCR.width);
		const translateX = Math.ceil(((this.lastBCR.width - this.firstBCR.width)) + padding);
		const translateY = Math.ceil(((this.firstBCR.top - this.lastBCR.top)) - padding);

		this.target.style.transform  = `translate(${translateX}px,${translateY}px) scale(${scaleRatio})`;
	}

	play (target) {
		target.style.willChange = 'transform';
		target.style.transform  = 'none';
	}
	
}

new Player();