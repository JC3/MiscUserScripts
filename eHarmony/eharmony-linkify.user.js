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
// @name         eHarmony Message Links
// @namespace    jasonc
// @updateURL    https://raw.githubusercontent.com/JC3/MiscUserScripts/master/eHarmony/eharmony-linkify.user.js
// @downloadURL  https://raw.githubusercontent.com/JC3/MiscUserScripts/master/eHarmony/eharmony-linkify.user.js
// @version      4
// @description  Turns URLs in eHarmony messages into clickable links.
// @author       Jason Cipriani
// @match        *://*.eharmony.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;

    $('<style/>')
        .attr('type', 'text/css')
        .text('.is-myMessage a { color:var(--COLOR_support2_100); }')
        .appendTo(document.head);

    new MutationObserver(function () {
        $('#conversationArea .messageText:not([data-jc-linkified="1"])')
            .attr('data-jc-linkified', 1)
            .find('.body')
            .each((_,e) => linkify(e))
    }).observe(document.body, {
        childList: true,
        subtree: true
    });

    function linkify (e) {
        var html = e.innerHTML.replace(/(https?:\/\/.*?)([.?!,]?(?:[\s<]|$))/g, '<a href="$1" target="_blank">$1</a>$2');
        e.innerHTML = html;
    }

})();
