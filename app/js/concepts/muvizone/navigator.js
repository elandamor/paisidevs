"use strict";function _classCallCheck(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,n){for(var t=0;t<n.length;t++){var i=n[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(n,t,i){return t&&e(n.prototype,t),i&&e(n,i),n}}(),Navigator=function(){function e(){_classCallCheck(this,e),this.body=document.body,this.el=document.getElementById("muvizone-app"),this.handle=this.el.querySelector(".l-movies-list"),this.sections=[].slice.call(this.handle.children),this.sectionsCount=this.sections.length,this.navDots=this.el.querySelector(".nav-dots"),this.navDotsLinks=[].slice.call(this.navDots.children),this.navArrows=[].slice.call(this.el.querySelector(".nav-arrows").children),this.navArrowUp=this.navArrows[0],this.navArrowDown=this.navArrows[1],this.art=[].slice.call(this.el.querySelector(".l-movie-art").children),this.onTransitionEnd=this.onTransitionEnd.bind(this),this.navigate=this.navigate.bind(this),this.getIndex=this.getIndex.bind(this),this.currentIndex=0,this.oldIndex=this.currentIndex,this.newIndex=null,this.art[this.currentIndex].classList.add("is-visible"),this.sections[this.currentIndex].classList.add("is-visible"),this.navDotsLinks[this.currentIndex].classList.add("is-active"),this.navigate(),this.addEventListeners()}return _createClass(e,[{key:"addEventListeners",value:function(){var e=this;this.navDotsLinks.forEach(function(n,t){n.addEventListener("click",function(n){n.preventDefault(),e.oldIndex=e.currentIndex,t!==e.currentIndex&&(requestAnimationFrame(e.navigate),e.currentIndex=t,e.newIndex=e.currentIndex)})}),this.navArrowUp.addEventListener("click",function(n){return e.oldIndex=e.currentIndex,e.currentIndex-=1,e.currentIndex<0?void(e.currentIndex=e.oldIndex):(requestAnimationFrame(e.navigate),void(e.newIndex=e.currentIndex))}),this.navArrowDown.addEventListener("click",function(n){return e.oldIndex=e.currentIndex,e.currentIndex+=1,e.currentIndex>e.sections.length-1?void(e.currentIndex=e.oldIndex):(requestAnimationFrame(e.navigate),void(e.newIndex=e.currentIndex))}),document.addEventListener("keydown",function(n){var t=n.keyCode||n.which,i=38,s=40;if(e.oldIndex=e.currentIndex,!e.body.classList.contains("detail-view")){if(t==i){if(e.currentIndex-=1,e.currentIndex<0)return void(e.currentIndex=e.oldIndex);requestAnimationFrame(e.navigate),e.newIndex=e.currentIndex}if(t==s){if(e.currentIndex+=1,e.currentIndex>e.sections.length-1)return void(e.currentIndex=e.oldIndex);requestAnimationFrame(e.navigate),e.newIndex=e.currentIndex}}})}},{key:"getIndex",value:function(){return this.currentIndex}},{key:"navigate",value:function(){var e=-(100*this.currentIndex);this.handle.style.transform="translateY("+e+"vh)",this.sections[this.oldIndex].classList.remove("is-visible"),this.sections[this.currentIndex].classList.add("is-visible"),this.art[this.oldIndex].classList.remove("is-visible"),this.art[this.currentIndex].classList.add("is-visible"),this.navDotsLinks.forEach(function(e){e.classList.remove("is-active")}),this.navDotsLinks[this.currentIndex].classList.add("is-active"),this.handle.addEventListener("transitionend",this.onTransitionEnd)}},{key:"onTransitionEnd",value:function(e){this.currentIndex<1?this.navArrowUp.classList.add("is-faded-out--mid"):this.currentIndex>0&&this.navArrowUp.classList.remove("is-faded-out--mid"),this.currentIndex>this.sections.length-2?this.navArrowDown.classList.add("is-faded-out--mid"):this.currentIndex<this.sections.length-1&&this.navArrowDown.classList.remove("is-faded-out--mid"),this.handle.removeEventListener("transitionend",this.onTransitionEnd)}}]),e}(),navigate=new Navigator;