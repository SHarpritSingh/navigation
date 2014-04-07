var keyhandler = {}
    , app
    , parent_nav
    , iterators = {}
    , focusedElm = false;

window.onload = function() {
  init();
};

keyhandler.handleUp = function () {
 resetFocus(iterators.getUpFocusable(focusedElm));
};

keyhandler.handleDown = function () {
  resetFocus(iterators.getDownFocusable(focusedElm));
};

keyhandler.handleLeft = function () {
  resetFocus(iterators.getLeftFocusable(focusedElm));
};

keyhandler.handleRight = function () {
  resetFocus(iterators.getRightFocusable(focusedElm));
};

keyhandler.register = function () {
  document.onkeyup=function(e){
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

iterators.getUpFocusable = function (elm) {
  var parent;
  if(!elm){
    return false;
  }else if(elm.getAttribute('data-nav') === 'top-container'){
    return false;
  }
  parent = elm.parentNode;
  if(parent){
    if(parent.getAttribute('data-nav') === 'vertical-container'){
      return iterators.getPrevFocusableSibling(elm);
    }else if(parent.getAttribute('data-nav') === 'top-container'){
      return iterators.getPrevFocusableSibling(elm);
    }else{
      return iterators.getUpFocusable(parent);
    }
  }
  return false;
};

iterators.getDownFocusable = function (elm) {
  var parent;
  if(!elm){
    return false;
  }else if(elm.getAttribute('data-nav') === 'top-container'){
    return false;
  }
  parent = elm.parentNode;
  if(parent){
    if(parent.getAttribute('data-nav') === 'vertical-container'){
      return iterators.getNextFocusableSibling(elm);
    }else if(parent.getAttribute('data-nav') === 'top-container'){
      return iterators.getNextFocusableSibling(elm);
    }else{
      return iterators.getDownFocusable(parent);
    }
  }
  return false;
};

iterators.getRightFocusable = function (elm) {
  var parent;
  if(!elm){
    return false;
  }else if(elm.getAttribute('data-nav') === 'top-container'){
    return false;
  }
  parent=elm.parentNode;
  if(parent){
    if(parent.getAttribute('data-nav') === 'horizontal-container'){
      return iterators.getNextFocusableSibling(elm);
    }else if(parent.getAttribute('data-nav') === 'top-container'){
      return iterators.getNextFocusableSibling(elm);
    }else{
      return iterators.getRightFocusable(parent);
    }
  }
  return false;
};

iterators.getLeftFocusable = function (elm) {
  var parent;
  if(!elm){
    return false;
  }else if(elm.getAttribute('data-nav') === 'top-container'){
    return false;
  }
  parent=elm.parentNode;
  if(parent){
    if(parent.getAttribute('data-nav') === 'horizontal-container'){
      return iterators.getPrevFocusableSibling(elm);
    }else if(parent.getAttribute('data-nav') === 'top-container'){
      return iterators.getPrevFocusableSibling(elm);
    }else{
      return iterators.getLeftFocusable(parent);
    }
  }
  return false;
};

iterators.getFirstFocusable = function (elm) {
  var all;
  if(!elm){
    return false;
  }
  if(elm && elm.getAttribute("data-nav") === 'focusable'){
    return elm;
  }
  all = elm.getElementsByTagName("*");
  for (var i=0, max=all.length; i < max; i++) {
    if(all[i].getAttribute("data-nav") === 'focusable'){
      return all[i];
    }
  }
  return false;
};

iterators.getNextFocusableSibling = function (elm) {
  var nxtSibling;
  if(!elm){
    return false;
  }
  nxtSibling = iterators.getNextSibling(elm);
  if(nxtSibling ){
    var focusable = iterators.getFirstFocusable(nxtSibling);
    if(focusable){
      return focusable;
    }else{
      return iterators.getNextFocusableSibling(nxtSibling);
    }
  }
  return false;
};

iterators.getPrevFocusableSibling = function (elm) {
  var nxtSibling;
  if(!elm){
    return false;
  }
  nxtSibling = iterators.getPrevSibling(elm);
  if(nxtSibling ){
    var focusable = iterators.getFirstFocusable(nxtSibling);
    if(focusable){
      return focusable;
    }else{
      return iterators.getPrevFocusableSibling(nxtSibling);
    }
  }
  return false;
}

// get non emppty text node as next sibling
iterators.getNextSibling = function (elm) {
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
iterators.getPrevSibling = function (elm) {
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