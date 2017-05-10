class QuotesButton {
    constructor(){
        // the main component element/wrapper
        this.shzEl = document.querySelector('.component');
        // the initial button
        this.shzCtrl = this.shzEl.querySelector('.button.button--start');
        // the svg element which contains the shape paths
        this.shzSVGEl = this.shzEl.querySelector('svg.morpher');
        // the SVG path
        this.shzPathEl = Snap(this.shzSVGEl).select('path');
        // simulation time for listening (ms)
        this.simulateTime = 3500;
        // window sizes
        this.winsize = {width: window.innerWidth, height: window.innerHeight};
        // button offset
        this.shzCtrlOffset = this.shzCtrl.getBoundingClientRect();
        // button sizes
        this.shzCtrlSize = {width: this.shzCtrl.offsetWidth, height: this.shzCtrl.offsetHeight};
        // tells us if the listening animation is taking place
        this.isListening = false;
        // audio player element
        this.playerEl = this.shzEl.querySelector('.player');

        this.bezier = (function(x1, y1, x2, y2, epsilon) {
            var curveX = function(t){
                var v = 1 - t;
                return 3 * v * v * t * x1 + 3 * v * t * t * x2 + t * t * t;
            };
            var curveY = function(t){
                var v = 1 - t;
                return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
            };
            var derivativeCurveX = function(t){
                var v = 1 - t;
                return 3 * (2 * (t - 1) * t + v * v) * x1 + 3 * (- t * t * t + 2 * v * t) * x2;
            };
            return function(t){
                var x = t, t0, t1, t2, x2, d2, i;
                // First try a few iterations of Newton's method -- normally very fast.
                for (t2 = x, i = 0; i < 8; i++){
                    x2 = curveX(t2) - x;
                    if (Math.abs(x2) < epsilon) return curveY(t2);
                    d2 = derivativeCurveX(t2);
                    if (Math.abs(d2) < 1e-6) break;
                    t2 = t2 - x2 / d2;
                }

                t0 = 0, t1 = 1, t2 = x;

                if (t2 < t0) return curveY(t0);
                if (t2 > t1) return curveY(t1);

                // Fallback to the bisection method for reliability.
                while (t0 < t1){
                    x2 = curveX(t2);
                    if (Math.abs(x2 - x) < epsilon) return curveY(t2);
                    if (x > x2) t0 = t2;
                    else t1 = t2;
                    t2 = (t1 - t0) * .5 + t0;
                }
                // Failure
                return curveY(t2);
            };
        });
    }
    init() {
        // bind events
        this.initEvents();
    }

    /**
     * event binding
     */
     initEvents() {
        // click on the initial button
        this.shzCtrl.addEventListener('click', this.listen.bind(this));

    }

    /**
     * transform the initial button into a circle shaped one that "listens" to the current song..
     */
     listen() {
        this.isListening = true;

        // toggle classes (button content/text changes)
        $(this.shzCtrl).removeClass('button--start');
        $(this.shzCtrl).addClass('button--listen');


        // animate the shape of the button (we are using Snap.svg for this)
        this.animatePath(this.shzPathEl, this.shzEl.getAttribute('data-path-listen'), 400, [0.8, -0.6, 0.2, 1], function() {
            // ripples start...
            $(this.shzCtrl).addClass('button--animate');
        }.bind(this));
    }

    /**
     * stop the ripples and notes animations
     */
     stopListening() {
        this.isListening = false;
        // ripples stop...
        $(this.shzCtrl).addClass('button--animate');
    }

    /**
     * shows the audio player
     */
     showPlayer() {
        // stop the ripples and notes animations
        this.stopListening();

        // morph the listening button shape into the audio player shape
        // we are setting a timeout so that there´s a small delay (it just looks nicer)
        setTimeout(function() {
            this.animatePath(this.shzPathEl, this.shzEl.getAttribute('data-path-player'), 450, [0.7, 0, 0.3, 1], function() {
                // show audio player
                $(this.playerEl).removeClass('player--hidden');
            }.bind(this));
            // hide button
            $(this.shzCtrl).addClass('button--hidden');
        }.bind(this), 250);
        // remove this class so the button content/text gets hidden
        $(this.shzCtrl).removeClass('button--listen');
    }

    /**
     * closes the audio player
     */
     closePlayer() {
        // hide the player
        $(this.playerEl).addClass('player--hidden');
        // morph the player shape into the initial button shape
        this.animatePath(this.shzPathEl, this.shzEl.getAttribute('data-path-start'), 400, [0.4, 1, 0.3, 1]);
        // show again the button and its content
        // we are setting a timeout so that there´s a small delay (it just looks nicer)
        setTimeout(function() {
            $(this.shzCtrl).removeClass('button-hidden').addClass('button--start')
        }.bind(this), 50);
    }

    /**
     * animates an SVG Path (using Snap.svg)
     *
     * @param {Element Node}  el - the path element
     * @param {string} path - the new path definition
     * @param {number} duration - animation time
     * @param {array|function} timingFunction - the animation easing. Either a Snap mina function or an array for the 4 bezier points
     * @param {function} callback - callback function
     */
     animatePath(el, path, duration, timingFunction, callback) {
        var epsilon = (1000 / 60 / duration) / 4, timingFunction = typeof timingFunction == 'function' ? timingFunction : this.bezier(timingFunction[0], timingFunction[1], timingFunction[2], timingFunction[3], epsilon);
        el.stop().animate({'path' : path}, duration, timingFunction, callback);
    }
}

export default QuotesButton;