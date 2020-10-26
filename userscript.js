// ==UserScript==
// @name         Gasoline
// @namespace    https://github.com/bentucker
// @version      0.1
// @description  Tinder enhancements
// @author       Ben Tucker
// @match        https://tinder.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
  'use strict';
  // Your CSS as text
  let styles = '.recsCardboard, .profileCard { height: 100% !important; max-width: 100% !important; width: 100% !important; }';
  let styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerHTML = styles;
  document.head.appendChild(styleSheet);

  let current = document.addEventListener;
  document.addEventListener = function(type, listener) {
    if (type == "keydown") {
      current.apply(this, [type, keyDownOverride(listener)]);
    } else if (type == "keyup") {
      current.apply(this, [type, keyUpOverride(listener)]);
    } else {
      current.apply(this, [type, listener]);
    }
  }

  function xpath(xpathToExecute) {
    let result = [];
    let nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i=0 ; i<nodesSnapshot.snapshotLength; i++) {
      result.push(nodesSnapshot.snapshotItem(i));
    }
    return result;
  }

  function createMouseEvent(clientX = 0) {
    return new MouseEvent("mouseup", {
      bubbles: true,
      cancelable: true,
      clientX: clientX,
      clientY: 0
    });
  }

  function navPhoto(direction) {
    let visibleSlides = xpath("//div[@id='content']//*[@aria-hidden='false']//*[contains(@class, 'keen-slider__slide') and @aria-hidden='false']")
      .concat(xpath("//*[contains(@class, 'profileCard')]//span[@aria-hidden='false']"));
    console.log(visibleSlides);
    if (visibleSlides != undefined && visibleSlides.length > 0) {
      let curSlide = visibleSlides[0];
      let boundingRect = curSlide.getBoundingClientRect();
      let evt = createMouseEvent(!direction * boundingRect.right);
      curSlide.dispatchEvent(evt);
    }
  }
  
  function keyDownOverride(listener) {
    return function(e) {
      if (e.keyCode == 32) {
        navPhoto(e.shiftKey);
      } else {
        listener(e);
      }
    }
  }

  function keyUpOverride(listener) {
    return function(e) {
      if (e.keyCode != 32) {
        listener(e);
      }
    }
  }
})();
