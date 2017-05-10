import MobileHeader from "../core/custom_elements/mobile-header";
import MobileView from "../core/custom_elements/mobile-view";
import Rating from "../core/custom_elements/rating";
import ProfileImage from "../core/custom_elements/profile-image";
import TabBar from "../core/custom_elements/tab-bar";
import TipToolTip from "../core/custom_elements/tip-helper";
import TipHelper from "../core/custom_elements/tip-tooltip";

export default class CustomElementManager {
    constructor(){
        new MobileHeader();
        new MobileView();
        new Rating();
        new ProfileImage();
        new TabBar();
        new TipToolTip();
        new TipHelper();
    }
}
