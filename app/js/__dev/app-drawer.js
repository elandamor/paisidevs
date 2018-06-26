'use strict';

class AppDrawer {
  constructor () {    
    this.showButtonEl         = document.querySelector('.app-bar--nav');
    this.appDrawerEl          = document.querySelector('.app-drawer');
    this.appDrawerContainerEl = document.querySelector('.app-drawer--container');

    this.showAppDrawer   = this.showAppDrawer.bind(this);
    this.hideAppDrawer   = this.hideAppDrawer.bind(this);
    this.blockClicks     = this.blockClicks.bind(this);
    this.onTouchStart    = this.onTouchStart.bind(this);
    this.onTouchMove     = this.onTouchMove.bind(this);
    this.onTouchEnd      = this.onTouchEnd.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
    this.update          = this.update.bind(this);

    this.startX            = 0;
    this.currentX          = 0;
    this.touchingAppDrawer = false;

    this.addEventListeners();
  }

  addEventListeners () {
    this.showButtonEl.addEventListener('click', this.showAppDrawer);
    this.appDrawerEl.addEventListener('click', this.hideAppDrawer);
    this.appDrawerContainerEl.addEventListener('click', this.blockClicks);

    this.appDrawerEl.addEventListener('touchstart', this.onTouchStart);
    this.appDrawerEl.addEventListener('touchmove', this.onTouchMove);
    this.appDrawerEl.addEventListener('touchend', this.onTouchEnd);
  }

  onTouchStart (evt) {
    if (!this.appDrawerEl.classList.contains('app-drawer--visible'))
      return;

    this.startX   = evt.touches[0].pageX;
    this.currentX = this.startX;

    this.touchingAppDrawer = true;
    requestAnimationFrame(this.update);
  }

  onTouchMove (evt) {
    if (!this.touchingAppDrawer)
      return;

    this.currentX = evt.touches[0].pageX;
    const translateX = Math.min(0, this.currentX - this.startX);

    if (translateX < 0) {
      evt.preventDefault();
    }
  }

  onTouchEnd (evt) {
    if (!this.touchingAppDrawer)
      return;

    this.touchingAppDrawer = false;

    const translateX = Math.min(0, this.currentX - this.startX);
    this.appDrawerContainerEl.style.transform = '';

    if (translateX < 0) {
      this.hideAppDrawer();
    }
  }

  update () {
    if (!this.touchingAppDrawer)
      return;

    requestAnimationFrame(this.update);

    const translateX = Math.min(0, this.currentX - this.startX);
    this.appDrawerContainerEl.style.transform = `translateX(${translateX}px)`;
  }

  blockClicks (evt) {
    evt.stopPropagation();
  }

  onTransitionEnd (evt) {
    this.appDrawerEl.removeEventListener('transitionend', this.onTransitionEnd);
  }

  showAppDrawer () {
    this.appDrawerEl.classList.add('app-drawer--visible');
    this.appDrawerEl.addEventListener('transitionend', this.onTransitionEnd);
  }

  hideAppDrawer () {
    this.appDrawerEl.classList.remove('app-drawer--visible');
    this.appDrawerEl.addEventListener('transitionend', this.onTransitionEnd);
  }
}

new AppDrawer();
