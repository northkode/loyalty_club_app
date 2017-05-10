// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;
(function ($, window, document, undefined) {
    "use strict";
    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.
    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).
    // Create the defaults once

    var pluginName = "jSwipe";
    var defaults = {};

    // plugin constructor
    function jSwipe(element, options) {
        this.settings = $.extend({}, options, {});
        this._defaults = defaults;
        this._name = pluginName;
        this.component = element;
        this.$component = $(element);
        if ( !element )return;

        this.init();
    }

    // create the component
    var p = jSwipe.prototype = {
        init: function () {
            this.config();
        }
    };

    p.config = function () {
        var touchsurface = this.component,
            swipedir,
            startX,
            startY,
            distX,
            distY,
            dist,
            threshold = 100, //required min distance traveled to be considered swipe
            restraint = 100, // maximum distance allowed at the same time in perpendicular direction
            allowedTime = 500, // maximum time allowed to travel that distance
            elapsedTime,
            startTime,
            handleswipe = this.settings.callback || function(swipedir){}

        touchsurface.addEventListener('touchstart', function(e){
            var touchobj = e.changedTouches[0]
            swipedir = 'none'
            dist = 0
            startX = touchobj.pageX
            startY = touchobj.pageY
            startTime = new Date().getTime() // record time when finger first makes contact with surface
            e.preventDefault()
        }, false)

        touchsurface.addEventListener('touchmove', function(e){
            e.preventDefault() // prevent scrolling when inside DIV
        }, false)

        touchsurface.addEventListener('touchend', function(e){
            var touchobj = e.changedTouches[0]
            distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
            distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
            elapsedTime = new Date().getTime() - startTime // get time elapsed
            if (elapsedTime <= allowedTime){ // first condition for awipe met
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                    swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
                }
                else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                    swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
                }
            }
            handleswipe(swipedir,touchsurface,e);
            e.preventDefault();
        }, false)
    }

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        options = options || {};
        options = $.extend({}, defaults, options);
        return this.each(function () {
            if ( !$.data(this, "plugin_" + pluginName) ) {
                $.data(this, "plugin_" + pluginName, new jSwipe(this, options));
            }
        });
    };

})(jQuery, window, document);

