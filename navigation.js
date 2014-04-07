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
  }else if(elm.getAttribute('data-nav') === 'top-container'){
    return false;
  }

  var parent;
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
  if(!elm){
    return false;
  }else if(elm.getAttribute('data-nav') === 'top-container'){
    return false;
  }

  var parent;
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
  if(!elm){
    return false;
  }else if(elm.getAttribute('data-nav') === 'top-container'){
    return false;
  }

  var parent=elm.parentNode;

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
  if(!elm){
    return false;
  }else if(elm.getAttribute('data-nav') === 'top-container'){
    return false;
  }

  var parent=elm.parentNode;

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
  if(!elm){
    return false;
  }
  if(elm && elm.getAttribute("data-nav") === 'focusable'){
    return elm;
  }

  var all = elm.getElementsByTagName("*");

  for (var i=0, max=all.length; i < max; i++) {
    if(all[i].getAttribute("data-nav") === 'focusable'){
      return all[i];
    };

  }
  return false;
};

iterators.getNextFocusableSibling = function (elm) {
  if(!elm){
    return false;
  }

  var nxtSibling = iterators.getNextSibling(elm);
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
    if(!elm){
    return false;
  }

  var nxtSibling = iterators.getPrevSibling(elm);
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