function Utils() {}

var p = Utils.prototype = {
    constructor: Utils
};

Utils.supports_html5_storage = function() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
};

Utils.forceRedraw = function(element) {
    var disp = element.style.display;
    element.style.display = 'none';
    var trick = element.offsetHeight;
    element.style.display = disp;
}

Utils.createDomFragment = function(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
};

Utils.dateConvert = function(currentTime) {
    var str = "";
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();

    if (minutes < 10) {
        minutes = "0" + minutes
    }
    str += (hours > 12 ? hours - 12 : hours) + ":" + minutes;
    if (hours > 11) {
        str += "PM";
    } else {
        str += "AM";
    }
    return str;
};

Utils.uniqueObject = function(arr) {
    return _.uniq(_.collect(arr, function(x) {
        delete x.id;
        return JSON.stringify(x);
    }));
};

Utils.checkVersionString = function(v1, v2, options) {
    var lexicographical = options && options.lexicographical,
        zeroExtend = options && options.zeroExtend,
        v1parts = v1.split('.'),
        v2parts = v2.split('.');

    function isValidPart(x) {
        return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
    }

    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
        return NaN;
    }

    if (zeroExtend) {
        while (v1parts.length < v2parts.length) v1parts.push("0");
        while (v2parts.length < v1parts.length) v2parts.push("0");
    }

    if (!lexicographical) {
        v1parts = v1parts.map(Number);
        v2parts = v2parts.map(Number);
    }

    for (var i = 0; i < v1parts.length; ++i) {
        if (v2parts.length == i) {
            return 1;
        }

        if (v1parts[i] == v2parts[i]) {
            continue;
        } else if (v1parts[i] > v2parts[i]) {
            return 1;
        } else {
            return -1;
        }
    }

    if (v1parts.length != v2parts.length) {
        return -1;
    }

    return 0;

}

// move this into a utility class eventually
Utils.capitaliseFirstLetter = function(string) {
    if (string == null || string == undefined) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};

Utils.createContentProxy = function(scope, method, params, viewData) {
    var data = viewData;
    return function(viewClass) {
        return method.apply(scope, [viewClass.default, params, data]);
    }
};

Utils.prettyNumber = function(number, decPlaces) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10, decPlaces);

    // Enumerate number abbreviations
    var abbrev = ["k", "m", "b", "t"];

    // Go through the array backwards, so we do the largest first
    for (var i = abbrev.length - 1; i >= 0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10, (i + 1) * 3);

        // If the number is bigger or equal do the abbreviation
        if (size <= number) {
            // Here, we multiply by decPlaces, round, and then divide by decPlaces.
            // This gives us nice rounding to a particular decimal place.
            number = Math.round(number * decPlaces / size) / decPlaces;

            // Add the letter for the abbreviation
            number += abbrev[i];

            // We are done... stop
            break;
        }
    }

    return number;
};

// get the subRoute changes
Utils.getObjectDiff = function(prev, now) {
    var changes = {};
    for (var prop in now) {
        if (!prev || prev[prop] !== now[prop]) {
            if (typeof now[prop] == "object") {
                var c = getChanges(prev[prop], now[prop]);
                if (!_.isEmpty(c)) // underscore
                    changes[prop] = c;
            } else {
                changes[prop] = now[prop];
            }
        }
    }
    return changes;
};

Utils.getDateDiff = function(date1, date2) {
    var second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24,
        week = day * 7;
    date1 = new Date(date1);
    date2 = new Date(date2);
    var timediff = date2 - date1;
    if (isNaN(timediff)) return NaN;
    var obj = {
        "years": date2.getFullYear() - date1.getFullYear(),
        "months": ((date2.getFullYear() * 12 + date2.getMonth()) - (date1.getFullYear() * 12 + date1.getMonth())),
        "weeks": Math.floor(timediff / week),
        "days": Math.floor(timediff / day),
        "hours": Math.floor(timediff / hour),
        "minutes": Math.floor(timediff / minute)
    };
    return obj;
};

// global pressEnter jquery event
$.fn.pressEnter = function(e, unbind) {
    return this.each(function() {
        if (unbind == true) {
            $(this).unbind('enterPress', e);
            $(this).keypress(null);
            return;
        }
        $(this).bind('enterPress', e);
        $(this).keypress(function(ev) {
            var keycode = (ev.keyCode ? ev.keyCode : ev.which);
            if (keycode == '13') {
                $(this).trigger('enterPress');
                $(this).trigger('enterPress');
            }
        })
    })
};

window.performance = window.performance || {};
performance.now = (function() {
    return performance.now || performance.webkitNow
})();


window.delay = function(length, oncomplete) {
    var steps = (length / 100) * (60 / 10),
        speed = length / steps,
        count = 0,
        start = new Date().getTime();

    function instance() {
        if (count++ == steps) {
            oncomplete(steps, count);
        } else {
            var diff = (new Date().getTime() - start) - (count * speed);
            window.setTimeout(instance, (speed - diff));
        }
    }
    window.setTimeout(instance, speed);
};

String.prototype.trunc = function(n) {
    return (this.length > n) ? this.substr(0, n - 1) + '&hellip;' : this;
};

$.fn.animateNumbers = function(stop, commas, duration, ease) {
    return this.each(function() {
        var $this = $(this);
        var isInput = $this.is('input');
        var start = parseInt(isInput ? $this.val().replace(/,/g, "") : $this.text().replace(/,/g, ""));
        var regex = /(\d)(?=(\d\d\d)+(?!\d))/g;
        commas = commas === undefined ? true : commas;

        // number inputs can't have commas or it blanks out
        if (isInput && $this[0].type === 'number') {
            commas = false;
        }

        $({
            value: start
        }).animate({
            value: stop
        }, {
            duration: duration === undefined ? 1000 : duration,
            easing: ease === undefined ? "swing" : ease,
            step: function() {
                isInput ? $this.val(Math.floor(this.value)) : $this.text(Math.floor(this.value));
                if (commas) {
                    isInput ? $this.val($this.val().replace(regex, "$1,")) : $this.text($this.text().replace(regex, "$1,"));
                }
            },
            complete: function() {
                if (parseInt($this.text()) !== stop || parseInt($this.val()) !== stop) {
                    isInput ? $this.val(stop) : $this.text(stop);
                    if (commas) {
                        isInput ? $this.val($this.val().replace(regex, "$1,")) : $this.text($this.text().replace(regex, "$1,"));
                    }
                }
            }
        });
    });
};



window.Utils = Utils;
