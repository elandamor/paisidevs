class StarRating {

	constructor () {
		this.movieContainer = document.querySelector('.l-movies-list');
		this.starContainer = [].slice.call(this.movieContainer.getElementsByClassName('meta-stars'));	
		
		this.init();	
	}

	init () {
		this.starContainer.forEach( (el, index) => {
			var stars      = [].slice.call(el.children);
			var totalStars = stars.length;
			var rating     = parseInt(el.getAttribute('data-rating'));
			var count      = totalStars - Math.round(rating);

			stars[count].classList.add('is-selected');

			el.addEventListener('click', evt => {
				const target = evt.target;

				stars.forEach( (star) => {
					star.classList.remove('is-selected');
				});

				target.classList.add('is-selected');
			});		
		});		
	}	

}

new StarRating();