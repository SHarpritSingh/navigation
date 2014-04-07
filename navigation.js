// vertical style implementation
var keyhandler = {}
    , app
    , parent_nav
    , iterators = {}
    , focusedElm = false;

window.onload = function() {
  init();
};

keyhandler.handleUp = function () {
  var lastFocus = focusedElm;  
  var tmp = iterators.getUpFocusable(focusedElm);
  if(tmp){
    focusedElm = tmp;
    unsetFocus(lastFocus);
    setFocus(focusedElm);
  }
};

keyhandler.handleDown = function () {
  var lastFocus = focusedElm;
  var tmp = iterators.getDownFocusable(focusedElm);
  if(tmp){
    focusedElm = tmp;
    unsetFocus(lastFocus);
    setFocus(focusedElm);
  }
};

keyhandler.handleLeft = function () {
  var lastFocus = focusedElm;
  var tmp = iterators.getLeftFocusable(focusedElm);
  if(tmp){
    focusedElm = tmp;
    unsetFocus(lastFocus);
    setFocus(focusedElm);
  }
};

keyhandler.handleRight = function () {
  var lastFocus = focusedElm;
  var tmp = iterators.getRightFocusable(focusedElm);
  if(tmp){
    focusedElm = tmp;
    unsetFocus(lastFocus);
    setFocus(focusedElm);
  }
};

keyhandler.register = function () {
  document.onkeydown=function(e){
    switch (e.keyCode) {
      case 38 :
        keyhandler.handleUp();
        break;
      case 40 :
        keyhandler.handleDown();
        break;
      case 37 :
        keyhandler.handleLeft();
        break;
      case 39 :
        keyhandler.handleRight();
        break;        
    }
  }
};

function init () {
  // set default focus
  app = document.getElementById('app');
  parent_nav = app.getAttribute('data-nav');
  if(parent_nav === 'top-container'){ 
      var firstFocusableChild = iterators.getFirstFocusable(app);
      setFocus(firstFocusableChild);
      focusedElm = firstFocusableChild;
  }
  keyhandler.register();
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

iterators.getUpFocusable = function (elm) {
  if(!elm){
    return false;
  }
  var parent, grandParent;
  parent = elm.parentNode;
  grandParent = parent ? parent.parentNode : false;
  if( parent.getAttribute('data-nav')==='vertical-container' || parent.getAttribute('id')==='app'){
    return iterators.getFirstFocusable(iterators.getPrevFocusableSibling(elm));
  }else if (parent.getAttribute('data-nav')==='horizontal-container') {
    if (grandParent && (grandParent.getAttribute('data-nav') === 'vertical-container'|| grandParent.getAttribute('data-nav') === 'top-container')) {
      return iterators.getFirstFocusable(iterators.getPrevFocusableSibling(parent));
    }
  }else if(parent.getAttribute('data-nav') === 'top-container'){
    return false;
  }
  return false;
};

iterators.getDownFocusable = function (elm) {
  if(!elm){
    return false;
  }
  var parent, grandParent;
  parent = elm.parentNode;
  grandParent = parent ? parent.parentNode : false;
  if( parent.getAttribute('data-nav')==='vertical-container' || parent.getAttribute('id')==='app'){
    return iterators.getFirstFocusable(iterators.getNextFocusableSibling(elm));
  }else if (parent.getAttribute('data-nav')==='horizontal-container') {
    if (grandParent && (grandParent.getAttribute('data-nav') === 'vertical-container' || grandParent.getAttribute('data-nav') === 'top-container')) {
      return iterators.getFirstFocusable(iterators.getNextFocusableSibling(parent));
    }
  }else if(parent.getAttribute('data-nav') === 'top-container'){
    return false;
  }
  return false;
};

iterators.getRightFocusable = function (elm) {
  if(!elm){
    return false;
  }
  var parent, grandParent;
  parent = elm.parentNode;
  grandParent = parent ? parent.parentNode : false;
  
  if(parent.getAttribute('id')==='app'){
    return false;
  } 
  
  
  if(parent.getAttribute('data-nav') === 'horizontal-container'){
    return iterators.getNextFocusableSibling(elm);
  }else if (parent.getAttribute('data-nav') === 'vertical-container') {
    if(grandParent && (grandParent.getAttribute('data-nav') === 'horizontal-container'|| grandParent.getAttribute('data-nav') === 'top-container')){
      return iterators.getFirstFocusable(iterators.getNextFocusableSibling(parent));
    }
  }else if(parent.getAttribute('data-nav') === 'top-container'){
    return false;
  }
  return false;  
};

iterators.getLeftFocusable = function (elm) {
  if(!elm){
    return false;
  }
  var parent, grandParent;
  parent = elm.parentNode;
  grandParent = parent ? parent.parentNode : false;
  
  if(parent.getAttribute('id')==='app'){
    return false;
  }
  
  if(parent.getAttribute('data-nav') === 'horizontal-container'){
    return iterators.getPrevFocusableSibling(elm);
  }else if (parent.getAttribute('data-nav') === 'vertical-container') {
    if(grandParent && (grandParent.getAttribute('data-nav') === 'horizontal-container'|| grandParent.getAttribute('data-nav') === 'top-container')){
      return iterators.getFirstFocusable(iterators.getNextFocusableSibling(parent));
    }
  }else if(parent.getAttribute('data-nav') === 'top-container'){
    return false;
  }
  return false;
};

iterators.getFirstFocusable = function (elm) {  
  if(!elm){
    return false;
  }
  if(elm.getAttribute('data-nav') === 'focusable'){
    return elm;
  }else{
    if(elm.firstElementChild && elm.firstElementChild.getAttribute('data-nav') === 'focusable'){
      return elm.firstElementChild;
    }
    return iterators.getNextFocusableSibling(elm.firstElementChild);
  }
  return false;
};

iterators.getNextFocusableSibling = function (elm) {
  if(!elm){
    return false;
  } 
  var nxtSibling = iterators.getNextSibling(elm);
  if(nxtSibling){
    if(nxtSibling.getAttribute('data-nav').indexOf('container') !== -1){
      return iterators.getFirstFocusable(nxtSibling);
    }else if (nxtSibling.getAttribute('data-nav') === 'focusable') {
      return nxtSibling;
    }
  }
  return elm;
};

iterators.getPrevFocusableSibling = function (elm) {
  if(!elm){
    return false;
  }
  var prevSibling = iterators.getPrevSibling(elm);
  if(prevSibling){
    if(prevSibling.getAttribute('data-nav').indexOf('container') !== -1){
      return iterators.getFirstFocusable(prevSibling);
    }else if (prevSibling.getAttribute('data-nav') === 'focusable') {
      return prevSibling;
    }
  }
  return elm;
}

// get non emppty text node as next sibling
iterators.getNextSibling = function (elm) {
  if(!elm){
    return false;
  }
  var nxtSibling = elm.nextSibling;
  while (nxtSibling && nxtSibling.nodeType!=1) {
    nxtSibling=nxtSibling.nextSibling;
  }
  return nxtSibling;
}

// get non emppty text node as prev sibling
iterators.getPrevSibling = function (elm) {
  if(!elm){
    return false;
  }
  var prevSibling = elm.previousSibling;
  while (prevSibling && prevSibling.nodeType!=1) {
    prevSibling=prevSibling.previousSibling;
  }
  return prevSibling;
}