class Movie {

	constructor () {
		this.body      = document.body;
		this.container = document.querySelector('.l-movies-list');

		this.movie = [].slice.call(this.container.children);

		this.dv            = document.querySelector('.l-dv');
		this.underlay      = document.querySelector('.l-dv-underlay');
		this.sidebarL      = this.dv.querySelector('.l-dv-sidebar__L');
		this.sidebarR      = this.dv.querySelector('.l-dv-sidebar__R');
		this.content       = this.dv.querySelector('.l-dv-content');
		this.metaDirector  = this.dv.querySelector('.director-holder');
		this.metaWriter    = this.dv.querySelector('.writers-holder');
		this.metaRuntime   = this.dv.querySelector('.meta-runtime');
		this.metaRating    = this.dv.querySelector('.meta-rating');
		this.metaGenre     = this.dv.querySelector('.genre-holder');
		this.metaStoryline = this.dv.querySelector('.storyline-holder');
		this.metaCast      = this.dv.querySelector('.cast-holder');
		this.metaTrivia    = this.dv.querySelector('.trivia-holder');
		this.metaQuotes    = this.dv.querySelector('.quotes-holder');
		this.metaReviews   = this.dv.querySelector('.reviews-holder');

		this.promote         = this.promote.bind(this);
		this.animations      = this.animations.bind(this);
		this.resetAnimations = this.resetAnimations.bind(this);
		this.animatePoster   = this.animatePoster.bind(this);
		this.resetPoster     = this.resetPoster.bind(this);
		this.loadDetails     = this.loadDetails.bind(this);
		this.animateDetails  = this.animateDetails.bind(this);
		this.resetDetails    = this.resetDetails.bind(this);
		this.animateUnderlay = this.animateUnderlay.bind(this);
		this.resetUnderlay   = this.resetUnderlay.bind(this);

		this.keyTriggered = false;

		this.addEventListeners();
	}

	addEventListeners () {
		this.movie.forEach((el,idx) => {
			el.addEventListener('click', evt => {
				const target = evt.target;
				
				if (!target.classList.contains('l-dv--trigger') && !this.keyTriggered)
					return;

				const container = target.parentNode;

				this.poster   = container.querySelector('.c-card-poster');
				this.metadata = container.querySelector('.c-card-metadata');

				let opts = {  
	                method  : 'GET',
	                headers : {
	                    "Content-type": `application/x-www-form-urlencoded; charset=UTF-8`  
	                }, 
	                body: `null`
	            };

				let request = new Fetch('/__server/json/muvizone-db.json', opts);

				request.data().then( (data) => {
                	const targetIndex = navigate.getIndex();
                	const metadata = data.movies[targetIndex];

                	const runtimeInSeconds = runtime => {
                		let time = runtime.split('h');
                		let runtimeInSeconds = (parseInt(time[0]) * 60) + parseInt(time[1]);

                		return runtimeInSeconds;
                	}

					this.title     = metadata.title.split(/: |:/g);
					this.year      = metadata.release_year;
					this.runtime   = runtimeInSeconds(metadata.runtime);
					this.genre     = metadata.genre.split(/, |,/g);
					this.rating    = metadata.content_rating;
					this.director  = metadata.director.split(/, |,/g);
					this.writer    = metadata.writer.split(/, |,/g);
					this.cast      = metadata.cast.split(/, |,/g);
					this.storyline = metadata.storyline ? metadata.storyline : metadata.summary;
					this.trivia    = metadata.trivia ? metadata.trivia : '';
					this.quotes    = metadata.quotes ? metadata.quotes : '';
					this.reviews   = metadata.reviews ? metadata.reviews : '';

					this.animations();
	            }); 
			});
		});

		document.addEventListener('keydown', (ev) => {

			let keyCode = ev.keyCode || ev.which;
			const ESC = 27;
			const ENTER = 13;

			if (keyCode == ENTER && !this.body.classList.contains('detail-view')) {
				ev.preventDefault();

				this.keyTriggered = true;
				
				let event = document.createEvent('HTMLEvents');
				event.initEvent('click', true, false);

				this.movie[navigate.getIndex()].querySelector('.c-card-poster').dispatchEvent(event);
			}

			if (keyCode == ESC && this.body.classList.contains('detail-view')) {
				ev.preventDefault();
				movie.resetAnimations();
			}
		}); 
	}

	promote () {
		this.container.classList.add('no-pointer-events');
		this.metadata.classList.add('is-faded-out');
		this.metadata.style.transitionDuration = '.15s';
	}

	animations () {
		if (this.poster.classList.contains('is-animated')) {
			this.resetAnimations();
			return;
		}

		this.promote();

		requestAnimationFrame(this.animatePoster);
		this.loadDetails();
		requestAnimationFrame(this.animateUnderlay);
		requestAnimationFrame(this.animateDetails)
	}

	resetAnimations () {
		this.container.classList.remove('no-pointer-events');
		requestAnimationFrame(this.resetDetails);
		requestAnimationFrame(this.resetPoster);
		requestAnimationFrame(this.resetUnderlay);
	}

	animatePoster () {
		const onTransitionEnd = evt => {	
			console.timeEnd('meta-poster-animation');

			this.poster.classList.add('is-animated');
			this.poster.removeEventListener('transitionend', onTransitionEnd);
		}

		this.body.classList.add('detail-view');

		/*****************************************
		 * Get current and final poster position.
		 *****************************************/

		this.posterBCR = this.poster.getBoundingClientRect();

		const final_T_offset = document.querySelector('.app-header').getBoundingClientRect().height;
		const final_L_offset = 0;

		const targetContainerWidth = 250; // px
		const padding = 24; // px

		const translateX = final_L_offset - Math.ceil(this.posterBCR.left);
		const translateY = final_T_offset - Math.ceil(this.posterBCR.top);

		const scaleRatio = Math.abs(( targetContainerWidth - ( padding * 2 ) ) / this.posterBCR.width); // 6.25 is placeholder for scale(1."025") bug.

		console.log('scaleRatio',scaleRatio);

		console.time('meta-poster-animation');

		/************************************
		 * Animate poster to final position.
		 ************************************/

		this.poster.style.willChange = 'transform';
		this.poster.style.transform  = `translate(${translateX}px,${translateY}px)`;

		this.poster.addEventListener('transitionend', onTransitionEnd);
	}

	resetPoster () {
		const onTransitionEnd = evt => {

			this.poster.removeEventListener('transitionend', onTransitionEnd);
		};

		this.metadata.classList.remove('is-faded-out');
		this.metadata.style.transitionDuration = '.5s';

		this.poster.style.willChange = 'initial';
		this.poster.style.transform  = '';
		this.poster.classList.remove('is-animated');

		this.body.classList.remove('detail-view');

		this.poster.addEventListener('transitionend', onTransitionEnd);
	}

	loadDetails () {
		console.time(`load-details`);

		/************************************
		 * Load movie title, subtitle and release-year.
		 ************************************/

		this.dv.querySelector('.title').textContent        = '';
		this.dv.querySelector('.subtitle').textContent     = '';
		this.dv.querySelector('.title').textContent        = this.title[0];
		this.dv.querySelector('.subtitle').textContent     = this.title[1] ? ': ' + this.title[1] : '';	
		this.dv.querySelector('.release-year').textContent = this.year;

		/************************************
		 * Load movie genres.
		 ************************************/

		this.metaGenre.innerHTML = '';

		for ( let genre in this.genre ) {
			let tag      = this.genre[genre];
			let strinner = `<a class="genre">${tag}</a>`;

	      this.metaGenre.innerHTML += strinner;                         
	    } 

	    /************************************
		 * Load movie director(s).
		 ************************************/

		this.metaDirector.innerHTML = '';

		for ( let director in this.director ) {
			let tag      = this.director[director];
			let strinner = `<a class="director">${tag}</a>`;

	      this.metaDirector.innerHTML += strinner;                         
	    } 

	    /************************************
		 * Load movie writer(s).
		 ************************************/

		this.metaWriter.innerHTML = '';

		for ( let writer in this.writer ) {
			let tag      = this.writer[writer];
			let strinner = `<a class="writer">${tag}</a>`;

	      this.metaWriter.innerHTML += strinner;                         
	    } 

	    /************************************
		 * Load movie runtime.
		 ************************************/

	    this.metaRuntime.innerHTML = `<a class="runtime">${this.runtime} min</a>`;

	    /************************************
		 * Load movie rating.
		 ************************************/

		this.metaRating.className = 'meta-rating';
		this.metaRating.classList.add(`rated-${this.rating}`);

		/************************************
		 * Load movie storyline.
		 ************************************/

		this.metaStoryline.innerHTML = '';
		this.metaStoryline.innerHTML = this.storyline;

		/************************************
		 * Load movie cast.
		 ************************************/

		this.metaCast.innerHTML = '';  

		for ( let actor in this.cast ) {
			let name     = this.cast[actor]; 
			let strinner = `<figure class="actor-avatar"><img/><figcaption class="actor"></figcaption></figure>`;

			this.metaCast.innerHTML += strinner;                         
	    } 

	    /************************************
		 * Load movie trivia.
		 ************************************/

		// let trivia = `<a class="trivia">${this.trivia}</a>`;

		// this.metaTrivia.innerHTML = '';  
		// this.metaTrivia.innerHTML = trivia; 

		/************************************
		 * Load movie quote(s).
		 ************************************/

		// this.metaQuotes.innerHTML = '';  

		//  for ( let quote in this.quotes ) {
		// 	let tag      = this.quotes[quote];
		// 	let strinner = `<a class="quote"><span class="quote-speaker">${tag.speaker}  </span>" ${tag.quote} "</a>`;

		// 	this.metaQuotes.innerHTML += strinner;                         
	 //    } 

		/************************************
		 * Load movie title for soundtrack id.
		 ************************************/

		let soundtrack_movie = this.title[0];

		if (this.title[1] != undefined)
			soundtrack_movie += this.title[1] ? ': ' + this.title[1] : '';

		document.querySelector('.soundtrack-holder .c-card__header span').innerHTML = soundtrack_movie;

	    /************************************
		 * Load movie reviews(s).
		 ************************************/

		this.metaReviews.innerHTML = '';  

		 for ( let review in this.reviews ) {
			let tagline  = this.reviews[review].tagline;
			let body     = this.reviews[review].body;
			let strinner = `<div class="review user-review"><h4 class="meta-tagline">${tagline}</h4><div class="meta-body">${body}</div></div>`;

			this.metaReviews.innerHTML += strinner;                         
	    }                        

	    requestAnimationFrame(_ => {
	    	console.timeEnd(`load-details`);
	    });
	}

	animateDetails () {
		this.content.scrollTop = 0;
		this.metaCast.scrollLeft = 0;
		this.dv.classList.add('is-visible');
		this.dv.style.transitionDuration = '.5s';
	}

	resetDetails () {
		this.dv.classList.remove('is-visible');
		this.dv.style.willChange = 'initial';
		this.dv.style.transitionDuration = '.2s';
	}

	animateUnderlay () {
		const onTransitionEnd = evt => {
			this.underlay.removeEventListener('transitionend', onTransitionEnd);
		}

		this.underlay.style.willChange      = 'opacity, transform';
		this.underlay.style.transform       = 'scale(1)';
		this.underlay.style.opacity         = 1;
		this.underlay.style.transformOrigin = `${this.posterBCR.left}px ${this.posterBCR.top}px`;

		this.underlay.addEventListener('transitionend', onTransitionEnd);
	}

	resetUnderlay () {
		this.underlay.style.willChange = 'initial';
		this.underlay.style.transform  = 'scale(0)';
	}
}

let movie = new Movie();