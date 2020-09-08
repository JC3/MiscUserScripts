/*
MIT License

Copyright (c) 2020 Jason C

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// ==UserScript==
// @name         eHarmony Message Count
// @namespace    jasonc
// @updateURL    https://raw.githubusercontent.com/JC3/MiscUserScripts/master/eHarmony/eharmony-message-count-nosound.user.js
// @downloadURL  https://raw.githubusercontent.com/JC3/MiscUserScripts/master/eHarmony/eharmony-message-count-nosound.user.js
// @version      4
// @description  Puts new message count in eHarmony title bar.
// @author       Jason Cipriani
// @match        *://*.eharmony.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var title = document.title;
    var currentCount = '';

    // this could probably be performance-optimized with mutation
    // observers but it seems the bubble element is sometimes
    // destroyed and recreated, especially on doc load, and this
    // ends up being way simpler code. we'll keep the timer slow.
    setInterval(function () {
        var bubble = document.querySelector("#messenger .bubble");
        if (bubble) {
            updateMessageCount(parseInt(bubble.textContent));
        }
    }, 2000);

    function updateMessageCount (count) {
        if (count != currentCount) {
            currentCount = count;
            document.title = (currentCount > 0) ? `(${currentCount}) ${title}` : title;
        }
    }

})();
