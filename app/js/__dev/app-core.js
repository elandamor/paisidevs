'use strict';

class AppHeader extends HTMLElement {
  createdCallback () {
    console.log('Created app-header custom element.');
  }
}

class AppBar extends HTMLElement {
  createdCallback () {
    console.log('Created app-bar custom element.');
  }
}

class AppDrawer extends HTMLElement {
  createdCallback () {
    console.log('Created app-drawer custom element.');
  }
}

class AppContent extends HTMLElement {
  createdCallback () {
    console.log('Created app-content custom element.');
  }
}

document.registerElement('app-header', AppHeader);
document.registerElement('app-bar', AppBar);
document.registerElement('app-drawer', AppDrawer);
document.registerElement('app-content', AppContent);