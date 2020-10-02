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
// @name         eHarmony Conversation Log
// @namespace    jasonc
// @updateURL    https://raw.githubusercontent.com/JC3/MiscUserScripts/master/eHarmony/eharmony-convo-log.user.js
// @downloadURL  https://raw.githubusercontent.com/JC3/MiscUserScripts/master/eHarmony/eharmony-convo-log.user.js
// @version      1
// @description  Provides console utilities for retrieving and saving conversations.
// @author       Jason Cipriani
// @match        *://*.eharmony.com/*
// ==/UserScript==

(function() {
    'use strict';

    var jQuery = unsafeWindow.jQuery;
    var loadInterval = null;

    unsafeWindow.MessageLogger = {
        loadOldMessages: loadOldMessages,
        getLoadedMessages: getLoadedMessages
    }

    function loadOldMessages (backTo) {

        if (loadInterval) {
            console.log('error: loading already in progress.');
            return;
        }

        loadInterval = setInterval(function () {
            var finished = jQuery('#loadOlderMessages').click().length == 0;
            if (backTo) {
                var oldest = jQuery('#conversationArea .messageRow:first').attr('data-message-timestamp');
                finished = finished || (oldest <= backTo);
                console.log(`still working... ${oldest} ---> ${backTo}`);
            } else {
                console.log('still working...');
            }
            if (finished) {
                clearInterval(loadInterval);
                loadInterval = null;
                console.log('finished');
            }
        }, 750);

    }

    function getLoadedMessages (asHTML) {

        var convo = [];

        jQuery('#conversationArea .messageRow').each(function (n, e) {
            e = jQuery(e);
            var msg = (asHTML ? e.find('.messageText .body').html() : e.find('.messageText .body').text().trim());
            convo.push({
                me: e.hasClass('is-myMessage'),
                id: e.attr('id'),
                ts: e.attr('data-message-timestamp'),
                msg: msg
            });
        });

        return convo;

    }

})();
