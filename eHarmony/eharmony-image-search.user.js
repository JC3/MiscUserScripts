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
// @name         eHarmony Google Image Search (Beta)
// @namespace    jasonc
// @updateURL    https://raw.githubusercontent.com/JC3/MiscUserScripts/master/eHarmony/eharmony-image-search.user.js
// @downloadURL  https://raw.githubusercontent.com/JC3/MiscUserScripts/master/eHarmony/eharmony-image-search.user.js
// @version      5
// @description  Adds a reverse image search button to match images.
// @author       Jason Cipriani
// @match        *://*.eharmony.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const gisButtonStyle = `
        .jc-gis-button {
            position: absolute;
            left: 3px;
            bottom: 6px;
            display: inline-block;
            border-radius: 4px;
            font: var(--FONT_50_highlight);
            text-transform: uppercase;
            background-color: hsla(var(--COLOR_alertInfo_100-h), var(--COLOR_alertInfo_100-s), var(--COLOR_alertInfo_100-l), 80%);
            padding: 4px 6px 4px 6px;
            margin: 0 0 0 4px;
            color: var(--COLOR_support2_100);
            z-index: 1000000;
            text-decoration: none;
        }
        .jc-gis-button:hover {
            filter: brightness(150%);
        }
    `;

    var $ = window.jQuery;

    $('<style/>')
        .attr('type', 'text/css')
        .text(gisButtonStyle)
        .appendTo(document.head);

    new MutationObserver(function (ms) {
        updatePhotoLinks();
    }).observe(document.body, {
        childList: true,
        subtree: true
    });

    function updatePhotoLinks () {
        $(':not(.photoMask, .js-openSlideshow, .js-linkToProfile) > .u-photoProtector + .photo[style]:not([data-jc-gis-fixed=1])').each(function (n,el) {
            el = $(el);
            let url = el.css('background-image')
                .replace(/^url\(["']?/, '')
                .replace(/["']?\)$/, '')
                .trim();
            if (url != "") {
                if (!url.includes('placeholder')) {
                    $('<a/>')
                        .addClass('jc-gis-button')
                        .attr('href', `https://www.google.com/searchbyimage?image_url=${encodeURIComponent(url)}`)
                        .attr('target', '_blank')
                        .text('GIS')
                        .click((e) => e.stopPropagation())
                        .appendTo(el);
                }
                el.attr('data-jc-gis-fixed', 1);
            }
        });
    }

})();
