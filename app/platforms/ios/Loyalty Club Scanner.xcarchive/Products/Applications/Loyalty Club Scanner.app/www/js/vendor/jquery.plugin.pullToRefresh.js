/*
 Xpull - pull to refresh jQuery plugin for iOS and Android
 by Slobodan Jovanovic
 Initially made for Spreya app spreya.com

 Usage:

 $('selector').xpull(options);

 Example

 $('#container').xpull({
 'callback':function(){
 console.log('Released...');
 }
 });

 Options:

 {
 'pullThreshold':50, // Pull threshold - amount in pixels after which the callback is activated
 'callback':function(){}, // triggers after user pulls the content over pull threshold
 'spinnerTimeout':2000 // timeout in miliseconds after which the loading indicator stops spinning. If set to 0 - the loading will be indefinite
 }

 To get the instance of Xpull:

 var xpull = $('selector').data("plugin_xpull");

 Methods:

 reset() - cancels he spinning and resets the plugin to initial state. Example: $('#container').data('plugin_xpull').reset();

 */

define(function(){
    var pluginName = "xpull",
        defaults = {
            pullThreshold:50,
            spinnerTimeout:2000,
            callback:function(){}
        };
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }
    Plugin.prototype = {
        init: function() {
            var inst = this;
            var $holder = $(inst.element);
            var elm = $holder.children().wrapAll("<div class='scrollable'></div>").parent();;
            inst.elm = elm;
            $holder.find('.pull-indicator').remove();
            $holder.prepend('<div class="pull-indicator"><div class="arrow-body"></div><div class="triangle-down"></div><div class="pull-spinner"></div></div>');
            inst.indicator = $holder.find('.pull-indicator:eq(0)');
            inst.spinner = $holder.find('.pull-spinner:eq(0)');
            inst.arrow = $holder.find('.arrow-body:eq(0),.triangle-down:eq(0)');
            inst.indicatorHeight = inst.indicator.outerHeight();
            elm.css({
                '-webkit-transform':"translate3d(0px, -"+inst.indicatorHeight+"px, 0px)",
                'transform':"translate3d(0px, -"+inst.indicatorHeight+"px, 0px)"
            });
            elm.css({
                '-webkit-overflow-scrolling': 'touch',
                'overflow-y':'auto'
            });
            var ofstop = $holder.offset().top;
            var fingerOffset = 0;
            var top = 0;
            var hasc = false;
            inst.elast = true;
            $holder.unbind('touchstart.'+pluginName);
            $holder.on('touchstart.'+pluginName, function(ev){
                fingerOffset = ev.originalEvent.touches[0].pageY - ofstop;
            });
            $holder.unbind('touchmove.'+pluginName);
            $holder.on('touchmove.'+pluginName, function(ev){
                if(elm.position().top < 0 || $holder.scrollTop() > 0){ // trigger callback only if pulled from the top of the list
                    return true;
                }

                top = (ev.originalEvent.touches[0].pageY - ofstop - fingerOffset);
                if(top > 1){
                    if(inst.elast){
                        $(document.body).on('touchmove.'+pluginName,function(e){
                            e.preventDefault();
                        });
                        inst.elast = false;
                    }
                    $(elm).css({
                        '-webkit-transform': "translate3d(0px, " + (top - inst.indicatorHeight) + "px, 0px)",
                        'transform': "translate3d(0px, " + (top - inst.indicatorHeight) + "px, 0px)"
                    });
                    inst.indicator.css({
                        'top': (top - inst.indicatorHeight) + "px"
                    });
                    if(top > inst.options.pullThreshold && !hasc){
                        inst.indicator.addClass('arrow-rotate-180');
                    }else if(top <= inst.options.pullThreshold && hasc){
                        inst.indicator.removeClass('arrow-rotate-180');
                    }
                }else{
                    $(document.body).unbind('touchmove.'+pluginName);
                    inst.elast = true;
                }
                hasc = inst.indicator.hasClass('arrow-rotate-180');

            });
            $holder.unbind('touchend.'+pluginName);
            $holder.on('touchend.'+pluginName, function(ev){
                if(top > 0){
                    if(top > inst.options.pullThreshold){
                        inst.options.callback.call(this);
                        inst.arrow.hide();
                        inst.spinner.show();
                        elm.css({
                            '-webkit-transform':'translate3d(0px, 0px, 0px)',
                            '-webkit-transition': '-webkit-transform 300ms ease',
                            'transform':'translate3d(0px, 0px, 0px)',
                            'transition': '-webkit-transform 300ms ease'
                        });
                        inst.indicator.css({
                            'top': "0px",
                            '-webkit-transition': 'top 300ms ease',
                            'transition': 'top 300ms ease'
                        });
                    }else{
                        inst.indicator.css({
                            'top': "-"+inst.indicatorHeight+"px",
                            '-webkit-transition': 'top 300ms ease',
                            'transition': 'top 300ms ease'
                        });
                        elm.css({
                            '-webkit-transform':'translate3d(0px, -'+inst.indicatorHeight+'px, 0px)',
                            '-webkit-transition': '-webkit-transform 300ms ease',
                            'transform':'translate3d(0px, -'+inst.indicatorHeight+'px, 0px)',
                            'transition': '-webkit-transform 300ms ease'
                        });
                    }
                    top = 0;
                }

                setTimeout(function(){
                    //inst.indicator.removeClass('arrow-rotate-180');
                    elm.css({
                        '-webkit-transition': '',
                        'transition': ''
                    });
                    inst.indicator.css({
                        '-webkit-transition': '',
                        'transition': ''
                    });
                    $(document.body).unbind('touchmove.'+pluginName);
                    inst.elast = true;
                }, 300);
            });
        },
        reset:function(){
            var inst = this;
            var elm = inst.elm;
            inst.indicator.css({
                'top': "-"+inst.indicatorHeight+"px",
                '-webkit-transition': 'top 300ms ease',
                'transition': 'top 300ms ease',
                'opacity':0
            });
            elm.css({
                '-webkit-transform':'translate3d(0px, -'+inst.indicatorHeight+'px, 0px)',
                'transform':'translate3d(0px, -'+inst.indicatorHeight+'px, 0px)',
                '-webkit-transition': '-webkit-transform 300ms ease',
                'transition': 'transform 300ms ease'
            });
            setTimeout(function(){
                inst.arrow.show();
                inst.spinner.hide();
                inst.indicator.removeClass('arrow-rotate-180');
                elm.css({
                    '-webkit-transition': '',
                    'transition': '',
                });
                inst.indicator.css({
                    '-webkit-transition': '',
                    'transition': '',
                    'opacity': ''
                });
                $(document.body).unbind('touchmove.'+pluginName);
                inst.elast = true;
            }, 300);
        },
        complete:function(){
            this.reset();
        }
    };
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };
});