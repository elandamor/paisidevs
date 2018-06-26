'use strict';

let body = document.body;

function addEventListeners() {
  document.addEventListener('DOMContentLoaded', () => {
		body.classList.add('app-ready'); 
	});
}

addEventListeners();