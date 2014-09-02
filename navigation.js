//easy navigation
var enav = {};
//callbacks to be called by main app
enav.upCallback, enav.downCallback, enav.leftCallback, enav.rightCallback, enav.init;
(function () {
  var keyhandler = {}
      , app
      , parent_nav
      , focusedElm = false
      , defaultFocus = false;

  this.init = function() {
    init.call(this);
    listenDOMChange.call(this);
  }.bind(this);

  keyhandler.handleUp = function () {
    resetFocus(this.getUpFocusable(focusedElm));
    if(typeof enav.upCallback === 'function'){
     enav.upCallback();
    }
  };

  keyhandler.handleDown = function () {
    resetFocus(this.getDownFocusable(focusedElm));
    if(typeof enav.downCallback === 'function'){
     enav.downCallback();
    }
  };

  keyhandler.handleLeft = function () {
    resetFocus(this.getLeftFocusable(focusedElm));
    if(typeof enav.leftCallback === 'function'){
     enav.leftCallback();
    }
  };

  keyhandler.handleRight = function () {
    resetFocus(this.getRightFocusable(focusedElm));
    if(typeof enav.rightCallback === 'function'){
     enav.rightCallback();
    }
  };

  keyhandler.register = function () {
    document.onkeyup=function(e){
      switch (e.keyCode) {
        case 38 :
          keyhandler.handleUp.call(this);
          break;
        case 40 :
          keyhandler.handleDown.call(this);
          break;
        case 37 :
          keyhandler.handleLeft.call(this);
          break;
        case 39 :
          keyhandler.handleRight.call(this);
          break;
      }
    }.bind(this);
  };

  this.getUpFocusable = function (elm) {
    var parent;
    if(!elm){
      return false;
    }else if(elm.getAttribute('data-nav') === 'top-container'){
      return false;
    }
    parent = elm.parentNode;
    if(parent){
      if(parent.getAttribute('data-nav') === 'vertical-container'){
        return this.getPrevFocusableSibling(elm);
      }else if(parent.getAttribute('data-nav') === 'top-container'){
        return this.getPrevFocusableSibling(elm);
      }else{
        return this.getUpFocusable(parent);
      }
    }
    return false;
  };

  this.getDownFocusable = function (elm) {
    var parent;
    if(!elm){
      return false;
    }else if(elm.getAttribute('data-nav') === 'top-container'){
      return false;
    }
    parent = elm.parentNode;
    if(parent){
      if(parent.getAttribute('data-nav') === 'vertical-container'){
        return this.getNextFocusableSibling(elm);
      }else if(parent.getAttribute('data-nav') === 'top-container'){
        return this.getNextFocusableSibling(elm);
      }else{
        return this.getDownFocusable(parent);
      }
    }
    return false;
  };

  this.getRightFocusable = function (elm) {
    var parent;
    if(!elm){
      return false;
    }else if(elm.getAttribute('data-nav') === 'top-container'){
      return false;
    }
    parent=elm.parentNode;
    if(parent){
      if(parent.getAttribute('data-nav') === 'horizontal-container'){
        return this.getNextFocusableSibling(elm);
      }else if(parent.getAttribute('data-nav') === 'top-container'){
        return this.getNextFocusableSibling(elm);
      }else{
        return this.getRightFocusable(parent);
      }
    }
    return false;
  };

  this.getLeftFocusable = function (elm) {
    var parent;
    if(!elm){
      return false;
    }else if(elm.getAttribute('data-nav') === 'top-container'){
      return false;
    }
    parent=elm.parentNode;
    if(parent){
      if(parent.getAttribute('data-nav') === 'horizontal-container'){
        return this.getPrevFocusableSibling(elm);
      }else if(parent.getAttribute('data-nav') === 'top-container'){
        return this.getPrevFocusableSibling(elm);
      }else{
        return this.getLeftFocusable(parent);
      }
    }
    return false;
  };

  this.getFirstFocusable = function (elm) {
    var all;
    if(!elm){
      return false;
    }
    if(elm && elm.getAttribute("data-nav") === 'focusable' && isVisible(elm)){
      return elm;
    }
    all = elm.getElementsByTagName("*");
    for (var i=0, max=all.length; i < max; i++) {
      if(all[i].getAttribute("data-nav") === 'focusable' && isVisible(all[i])){
        return all[i];
      }
    }
    return false;
  };

  this.getNextFocusableSibling = function (elm) {
    var nxtSibling;
    if(!elm){
      return false;
    }
    nxtSibling = this.getNextSibling(elm);
    if(nxtSibling){
      var focusable = this.getFirstFocusable(nxtSibling);
      if(focusable){
        return focusable;
      }else{
        return this.getNextFocusableSibling(nxtSibling);
      }
    }
    return false;
  };

  this.getPrevFocusableSibling = function (elm) {
    var nxtSibling;
    if(!elm){
      return false;
    }
    nxtSibling = this.getPrevSibling(elm);
    if(nxtSibling ){
      var focusable = this.getFirstFocusable(nxtSibling);
      if(focusable){
        return focusable;
      }else{
        return this.getPrevFocusableSibling(nxtSibling);
      }
    }
    return false;
  }

  // get non emppty text node as next sibling
  this.getNextSibling = function (elm) {
    var nxtSibling;
    if(!elm){
      return false;
    }
    nxtSibling = elm.nextSibling;
    while (nxtSibling && nxtSibling.nodeType!=1) {
      nxtSibling=nxtSibling.nextSibling;
    }
    return nxtSibling;
  }

  // get non emppty text node as prev sibling
  this.getPrevSibling = function (elm) {
    var prevSibling;
    if(!elm){
      return false;
    }
    prevSibling = elm.previousSibling;
    while (prevSibling && prevSibling.nodeType!=1) {
      prevSibling=prevSibling.previousSibling;
    }
    return prevSibling;
  }

  function setFocus (elm) {
    if(!elm){
      return false;
    }
    elm.classList.add('focus');
  }

  function unsetFocus (elm) {
    if(!elm){
      return false;
    }
    elm.classList.remove('focus');
  }

  function resetFocus (focus) {
    var lastfocus;
    if(focus){
      lastfocus = focusedElm;
      focusedElm = focus;
      unsetFocus(lastfocus);
      setFocus(focusedElm);
    }
  };

  function isVisible(elem) {
    if(elem.offsetWidth === 0 && elem.offsetHeight === 0 || elem.style.visibility==='hidden' || elem.parentNode.style.visibility==='hidden'){
      return false;
    }
    return true;
  }


  // safety block
  // never loose focus
  function listenDOMChange() {
    var target, observer, config;
    // select the target node
    target = document.querySelector('#app');

    // create an observer instance
    observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if(! isVisible(focusedElm)){
          resetFocus(defaultFocus);
        };
      });
    });

    // configuration of the observer:
    config = { attributes: true, childList: true, characterData: true, subtree: true};

    // pass in the target node, as well as the observer options
    observer.observe(target, config);
  }

  function init () {
    // set default focus
    app = document.getElementById('app');
    parent_nav = app.getAttribute('data-nav');
    if(parent_nav === 'top-container'){
        var firstFocusableChild = this.getFirstFocusable(app);
        setFocus(firstFocusableChild);
        focusedElm = firstFocusableChild;
        defaultFocus = focusedElm;
    }
    keyhandler.register.call(this);
  }


setTimeout(function(){
  //hide();
},10000);

function hide () {
  document.getElementById('box1').style.display = 'none';
}

}).apply(enav);

