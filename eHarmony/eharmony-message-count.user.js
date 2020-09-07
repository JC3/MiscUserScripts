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
// @updateURL    https://raw.githubusercontent.com/JC3/MiscUserScripts/master/eHarmony/eharmony-message-count.user.js
// @downloadURL  https://raw.githubusercontent.com/JC3/MiscUserScripts/master/eHarmony/eharmony-message-count.user.js
// @version      1
// @description  Puts new message count in eHarmony title bar.
// @author       Jason Cipriani
// @match        *://*.eharmony.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var title = document.title;
    var currentCount = '';
    var notificationSound = null;

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
            if (count > currentCount) {
                playNotificationSound();
            }
            currentCount = count;
            document.title = (currentCount > 0) ? `(${currentCount}) ${title}` : title;
        }
    }

    function playNotificationSound () {
        if (!notificationSound) {
            notificationSound = new Audio("data:audio/mpeg;base64,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HGQExTNRNZUxNGRqCp2UqM3aA+1l78+GqtnI0iDKs6eWCWQNKnZws8tOOp2mf9Zaa3qlxAFhwA0R/8LKVMqsaiAGHomXaZXDjEEfoP/7MMT1AEikhTWs8MHhCo5mvc2kbTmIbM8VULpJtEL6HHjzh1hvFm32CR6GCUKGdedMJpDLH28dIN3DNs34AAFMPCmXnDHDRMnZ2NFJ8JINId3uBu2LseeSRKewpBaAWUg+WkZU2VjNC6JtMvO6sza+Y9v7YgCxIGhLd+DDAjqBmoqjQd7C5LMlZ2FPSqjabCZJi0GI2h8dE4vNdv/7MMT0gEjQdTescMGo9pAnPc0MdRKaT4DwpiJEobBupNteGLXSi/p/CnPTZAAFqAMjOf8AAAa4KTXhnYiavtooCvIiCa5Hbr4AWxmzQJtJQ0Ds4LSXPeSdKMYqb0vXbXIlW1LKzJVTacAJoUDRFu/DRSJdoGpLtKTUijavUmJTNxrVhm4dLOsqRWFiQRDkjTGooSTzNzIjDrss7P/7MMT1gEh4fzWtmFLpAxAmvbSN3U5Oj7HQsZoRFkgAREt/AAAYSJObGYikV2cF6C/DjrQZAyeVvOREKZ9Mny8RYqBpY3Gp74yBunQg+ZnZFsiT/o3q6AdkQDEOBsq3/CcFnN2MGBCJ8meKEvepU/yt2c2ATF2Z2kGgyP2nQmet5Lq0iRZlukNGF2Jd77S72UxBTUUzLjEwMKqqqv/7MMT2gEfocTXt5MOo7o0m/aSN1YZYlwBnj8AAABoxfpppINNRS4nQc0JQwMbUoJkIc+MmlYtWOtw67g0FcblsUD0LAQMYVNiSVBcIKRXstUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7IMT8gEeMazWtZMOo/g2mvP0kNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zDE9QBHiGM16GTBqOUMpr2HmYRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+yDE/YBHnGcz7DzMaNyKJn2MpDVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQxPQAxXg5New9hOg+hOOgIDCNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=");
            notificationSound.controls = true;
            document.body.appendChild(notificationSound);
            console.log("notification sound initialized");
        }
        notificationSound.play();
    }

})();
