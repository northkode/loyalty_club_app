/**
 *
 * Version: 0.2.0
 * Author: Gianluca Guarini
 * Contact: gianluca.guarini@gmail.com
 * Website: http://www.gianlucaguarini.com/
 * Twitter: @gianlucaguarini
 *
 $(elm).on('tap',function(e,data){});
 $(elm).on('dbltap',function(e,data){});
 $(elm).on('longtap',function(e,data){});
 $(elm).on('swipeleft',function(e,data){});
 $(elm).on('swiperight',function(e,data){});
 $(elm).on('swipeup',function(e,data){});
 $(elm).on('swipedown',function(e,data){});
 *
 **/

(function(doc, win) {
    'use strict'
    if (typeof doc.createEvent !== 'function') return false // no tap events here
    // helpers
    var useJquery = typeof jQuery !== 'undefined',
        msEventType = function(type) {
            var lo = type.toLowerCase(),
                ms = 'MS' + type
            return navigator.msPointerEnabled ? ms : lo
        },
        debounce = function(fn, delay) {
            var t
            return function () {
                var args = arguments
                clearTimeout(t)
                t = setTimeout(function() {
                    fn.apply(null, args)
                }, delay)
            }
        },
        touchevents = {
            touchstart: msEventType('PointerDown') + ' touchstart',
            touchend: msEventType('PointerUp') + ' touchend',
            touchmove: msEventType('PointerMove') + ' touchmove'
        },
        setListener = function(elm, events, callback) {
            var eventsArray = events.split(' '),
                i = eventsArray.length

            while (i--) {
                elm.addEventListener(eventsArray[i], callback, false)
            }
        },
        getPointerEvent = function(event) {
            return event.targetTouches ? event.targetTouches[0] : event
        },
        getTimestamp = function () {
            return new Date().getTime()
        },
        sendEvent = function(elm, eventName, originalEvent, data) {
            var customEvent = doc.createEvent('Event')
            customEvent.originalEvent = originalEvent
            data = data || {}
            data.x = currX
            data.y = currY
            data.distance = data.distance

            // jquery
            if (useJquery) {
                customEvent = $.Event(eventName, {originalEvent: originalEvent})
                jQuery(elm).trigger(customEvent, data)
            }

            // addEventListener
            if (customEvent.initEvent) {
                for (var key in data) {
                    customEvent[key] = data[key]
                }
                customEvent.initEvent(eventName, true, true)
                elm.dispatchEvent(customEvent)
            }

            // inline
            if (elm['on' + eventName])
                elm['on' + eventName](customEvent)
        },

        onTouchStart = function(e) {

            var pointer = getPointerEvent(e)

            // caching the current x
            cachedX = currX = pointer.pageX
            // caching the current y
            cachedY = currY = pointer.pageY

            longtapTimer = setTimeout(function() {
                sendEvent(e.target, 'longtap', e)
                target = e.target
            }, longtapThreshold)

            // we will use these variables on the touchend events
            timestamp = getTimestamp();

            tapNum++

        },
        onTouchEnd = function(e) {

            var eventsArr = [],
                now = getTimestamp(),
                deltaY = cachedY - currY,
                deltaX = cachedX - currX

            // clear the previous timer if it was set
            clearTimeout(dblTapTimer)
            // kill the long tap timer
            clearTimeout(longtapTimer)

            if (deltaX <= -swipeThreshold)
                eventsArr.push('swiperight')

            if (deltaX >= swipeThreshold)
                eventsArr.push('swipeleft')

            if (deltaY <= -swipeThreshold)
                eventsArr.push('swipedown')

            if (deltaY >= swipeThreshold)
                eventsArr.push('swipeup')

            if (eventsArr.length) {
                for (var i = 0; i < eventsArr.length; i++) {
                    var eventName = eventsArr[i]
                    sendEvent(e.target, eventName, e, {
                        distance: {
                            x: Math.abs(deltaX),
                            y: Math.abs(deltaY)
                        }
                    })
                }
                // reset the tap counter
                tapNum = 0
            } else {

                if (
                    cachedX >= currX - tapPrecision &&
                    cachedX <= currX + tapPrecision &&
                    cachedY >= currY - tapPrecision &&
                    cachedY <= currY + tapPrecision
                ) {
                    if (timestamp + tapThreshold - now >= 0)
                    {
                        // Here you get the Tap event
                        sendEvent(e.target, tapNum >= 2 && target === e.target ? 'dbltap' : 'tap', e)
                        target= e.target
                    }
                }

                // reset the tap counter
                dblTapTimer = setTimeout(function() {
                    tapNum = 0
                }, dbltapThreshold)

            }
        },
        onTouchMove = function(e) {
            var pointer = getPointerEvent(e);
            currX = pointer.pageX
            currY = pointer.pageY
        },
        swipeThreshold = win.SWIPE_THRESHOLD || 100,
        tapThreshold = win.TAP_THRESHOLD || 400, // range of time where a tap event could be detected
        dbltapThreshold = win.DBL_TAP_THRESHOLD || 300, // delay needed to detect a double tap
        longtapThreshold = win.LONG_TAP_THRESHOLD || 1000, // delay needed to detect a long tap
        tapPrecision = win.TAP_PRECISION / 2 || 90 / 2, // touch events boundaries ( 60px by default )
        justTouchEvents = 'ontouchstart' in window,
        tapNum = 0,
        currX, currY, cachedX, cachedY, timestamp, target, dblTapTimer, longtapTimer

    //setting the events listeners
    // we need to debounce the callbacks because some devices multiple events are triggered at same time
    setListener(doc, touchevents.touchstart + (justTouchEvents ? '' : ' mousedown'), debounce(onTouchStart, 1))
    setListener(doc, touchevents.touchend + (justTouchEvents ? '' : ' mouseup'), debounce(onTouchEnd, 1))
    setListener(doc, touchevents.touchmove + (justTouchEvents ? '' : ' mousemove'), debounce(onTouchMove, 1))

}(document, window));