export default class GettingStarted {
    constructor(){

        var tour = $('.getting-started')[0];
        var timeline = new TimelineLite();
        timeline.to(tour, 0.5, {y:0, ease: Power4.easeOut });

        this._createListeners();
        this._createTimeline();
    }

    _createListeners(){
        $(document).on('click','.getting-started .takeTour',() => { this._onTakeTour(); });
        $(document).on('click','.getting-started .skip',(e) => {
            e.preventDefault();
			mobileApp.localSettings.setItem('repeatUser',true)
            var tour = $('.getting-started')[0];
            var timeline = new TimelineLite();
            timeline.to(tour, 0.3, {y:window.innerHeight, ease: Power4.easeOut,onComplete:function(){
                setTimeout(function() {
                    $('.getting-started').remove();
                },100);
            }});
        });
    }

    _createTimeline() {
        var tour = $('.take-tour-screen')[0];
        var tutorial = $('.tutorial-screen')[0];
        this.tl = new TimelineLite({paused:true});
        this.tl.to(tour, 0.3, {x:-window.innerWidth, ease: Power4.easeOut});
        this.tl.to(tutorial, 0.3, {x:0, ease: Power4.easeOut},"+=0");
    }

    _onTakeTour(e) {
        this.tl.play();
    }
}
