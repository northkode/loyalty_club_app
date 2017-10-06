#import <Cordova/CDVPlugin.h>
#import <objc/runtime.h>

@interface CDVKeyboard : CDVPlugin <UIScrollViewDelegate> {
    @protected
    id _keyboardShowObserver, _keyboardHideObserver;
    IMP wkOriginalImp, uiOriginalImp, nilImp;
    Method wkMethod, uiMethod;
}

@property (readwrite, assign, nonatomic) BOOL hideFormAccessoryBar;
@property (readwrite, assign) BOOL disableScroll;
//@property (readwrite, assign) BOOL styleDark;
- (void)hideFormAccessoryBar:(CDVInvokedUrlCommand*)command;

@end
