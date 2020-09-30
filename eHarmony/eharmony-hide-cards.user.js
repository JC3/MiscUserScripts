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
// @version      3
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
        printHidden: pubPrintHidden,
        unhideAll: pubUnhideAll,
        unhideOld: pubUnhideOld
    }

    $('<style/>')
        .attr('type', 'text/css')
        .text('.jc-hide-button,.jc-unhide-button { position:absolute; right:5px; font-size:small; font-weight:normal; }\n' +
              '.jc-unhide-button { display:none; }')
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
                .click(e => setCardHidden(e, true))
                .appendTo(e);
        }
        if (e.children('.jc-unhide-button').length == 0) {
            $('<a/>')
                .addClass('jc-unhide-button')
                .attr('href', '#')
                .text('Unhide')
                .click(e => setCardHidden(e, false))
                .appendTo(e);
        }
    }

    function setCardHidden (e, hidden) {
        var matchId = $(e.target).closest('.partnerItem').attr('href').match(/[?&]match=(\w+)/)[1];
        if (matchId) {
            GM.getValue('hidden', {}).then(function(r) {
                if (hidden) {
                    r[matchId] = Date.now();
                } else {
                    delete r[matchId];
                }
                return GM.setValue('hidden', r);
            }).then(updateHideStyles);
        }
        e.stopPropagation();
        return false;
    }

    function updateHideStyles () {
        return GM.getValue('hidden', {}).then(function(r) {
            var style = '';
            for (let id in r) {
                style += `a.partnerItem[href$="=${id}"] { filter:contrast(0) opacity(0.5); pointer-events:none; cursor:default; }\n`;
                style += `a.partnerItem[href$="=${id}"] .jc-hide-button { display:none; }\n`;
                style += `a.partnerItem[href$="=${id}"] .jc-unhide-button { display:initial; pointer-events:auto; }\n`;
            }
            hideStyles.text(style);
        });
    }

    function pubUnhideAll () {
        return GM.setValue('hidden', {}).then(updateHideStyles);
    }

    function pubPrintHidden () {
        return GM.getValue('hidden', {}).then(function(r) {
            console.log(r);
        });
    }

    function pubUnhideOld (days) {
        if (!(days > 0)) {
            console.log('pubUnhideOld(days): # of days must be > 0.');
            return;
        }
        return GM.getValue('hidden', {}).then(function (r) {
            var now = Date.now();
            var ms = days * 24 * 60 * 60000;
            var expired = [];
            for (let id in r) {
                if (now - r[id] >= ms) {
                    expired.push(id);
                }
            }
            for (let id of expired) {
                delete r[id];
            }
            if (expired.length > 0) {
                console.log(`unhid ${expired.length} old match(es).`);
                console.log(expired);
                return GM.setValue('hidden', r).then(updateHideStyles);
            }
        });
    }

})();
