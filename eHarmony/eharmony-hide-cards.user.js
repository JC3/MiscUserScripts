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
// @name         eHarmony Hide Cards
// @namespace    jasonc
// @updateURL    https://raw.githubusercontent.com/JC3/MiscUserScripts/master/eHarmony/eharmony-hide-cards.user.js
// @downloadURL  https://raw.githubusercontent.com/JC3/MiscUserScripts/master/eHarmony/eharmony-hide-cards.user.js
// @version      1
// @description  Hides cards of matches you don't want to see.
// @author       Jason Cipriani
// @match        *://*.eharmony.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// ==/UserScript==

(function() {
    'use strict';

    var $ = unsafeWindow.jQuery;

    unsafeWindow.HideCards = {
        unhideAll: pubUnhideAll,
        unhideLast: pubUnhideLast
    }

    $('<style/>')
        .attr('type', 'text/css')
        .text('.jc-hide-button{position:absolute;right:5px;font-size:small;font-weight:normal;}')
        .appendTo(document.head);

    var hideStyles = $('<style/>').appendTo(document.head);

    updateHideStyles();

    new MutationObserver(function () {
        $('.partnerItem .belowPicture h4').each((_,e) => addHideButton(e));
    }).observe(document.body, {
        childList: true,
        subtree: true
    });

    function addHideButton (e) {
        e = $(e);
        if (e.children('.jc-hide-button').length == 0) {
            $('<a/>')
                .addClass('jc-hide-button')
                .attr('href', '#')
                .text('Hide')
                .click(hideCard)
                .appendTo(e);
        }
    }

    function hideCard (e) {
        var matchId = $(e.target).closest('.partnerItem').attr('href').match(/[?&]match=(\w+)/)[1];
        if (matchId) {
            GM.getValue('hidden', []).then(function(r) {
                r.push(matchId);
                return GM.setValue('hidden', r);
            }).then(updateHideStyles);
        }
        e.stopPropagation();
        return false;
    }

    function updateHideStyles () {
        return GM.getValue('hidden', []).then(function(r) {
            var style = '';
            for (let id of r) {
                style += `a.partnerItem[href$="=${id}"] { display:none; }\n`;
            }
            hideStyles.text(style);
        });
    }

    function pubUnhideAll () {
        return GM.setValue('hidden', []).then(updateHideStyles);
    }

    function pubUnhideLast () {
        return GM.getValue('hidden', []).then(function(r) {
            r.pop();
            return GM.setValue('hidden', r);
        }).then(updateHideStyles);
    }

})();