/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

#import "CDVKeyboard.h"
#import <Cordova/CDVAvailability.h>
#import <objc/runtime.h>

@implementation CDVKeyboard;

@synthesize hideFormAccessoryBar = _hideFormAccessoryBar;
@synthesize disableScroll = _disableScroll;
//@synthesize styleDark = _styleDark;

- (void)pluginInitialize {

    Class wkClass = NSClassFromString([@[@"UI", @"Web", @"Browser", @"View"] componentsJoinedByString:@""]);
    wkMethod = class_getInstanceMethod(wkClass, @selector(inputAccessoryView));
    wkOriginalImp = method_getImplementation(wkMethod);
    Class uiClass = NSClassFromString([@[@"WK", @"Content", @"View"] componentsJoinedByString:@""]);
    uiMethod = class_getInstanceMethod(uiClass, @selector(inputAccessoryView));
    uiOriginalImp = method_getImplementation(uiMethod);
    nilImp = imp_implementationWithBlock(^(id _s) {
        return nil;
    });

    //set defaults
    self.hideFormAccessoryBar = NO;
    self.disableScroll = NO;
    //self.styleDark = NO;

    NSNotificationCenter* nc = [NSNotificationCenter defaultCenter];
    __weak CDVKeyboard* weakSelf = self;
    _keyboardShowObserver = [nc addObserverForName:UIKeyboardWillShowNotification
                               object:nil
                               queue:[NSOperationQueue mainQueue]
                               usingBlock:^(NSNotification* notification) {

                                   CGRect keyboardFrame = [notification.userInfo[UIKeyboardFrameEndUserInfoKey] CGRectValue];
                                   keyboardFrame = [self.viewController.view convertRect:keyboardFrame fromView:nil];

                                   [weakSelf.commandDelegate evalJs:[NSString stringWithFormat:@"Keyboard.isVisible = true; cordova.fireWindowEvent('native.keyboardshow', { 'keyboardHeight': %@ }); ", [@(keyboardFrame.size.height) stringValue]]];

                                   //deprecated
                                   [weakSelf.commandDelegate evalJs:[NSString stringWithFormat:@"cordova.fireWindowEvent('native.showkeyboard', { 'keyboardHeight': %@ }); ", [@(keyboardFrame.size.height) stringValue]]];
                               }];

    _keyboardHideObserver = [nc addObserverForName:UIKeyboardWillHideNotification
                               object:nil
                               queue:[NSOperationQueue mainQueue]
                               usingBlock:^(NSNotification* notification) {
                                   [weakSelf.commandDelegate evalJs:@"Keyboard.isVisible = false; cordova.fireWindowEvent('native.keyboardhide'); "];

                                   //deprecated
                                   [weakSelf.commandDelegate evalJs:@"cordova.fireWindowEvent('native.hidekeyboard'); "];
                               }];
}

- (BOOL)disableScroll {
    return _disableScroll;
}

- (void)setDisableScroll:(BOOL)disableScroll {
    if (disableScroll == _disableScroll) {
        return;
    }
    if (disableScroll) {
        self.webView.scrollView.scrollEnabled = NO;
        self.webView.scrollView.delegate = self;
    }
    else {
        self.webView.scrollView.scrollEnabled = YES;
        self.webView.scrollView.delegate = nil;
    }

    _disableScroll = disableScroll;
}

//keyboard swizzling inspired by:
//https://github.com/cjpearson/cordova-plugin-keyboard/

#pragma mark HideFormAccessoryBar

static IMP UIOriginalImp;
static IMP WKOriginalImp;

- (void)setHideFormAccessoryBar:(BOOL)hideFormAccessoryBar
{
    if (hideFormAccessoryBar == _hideFormAccessoryBar) {
        return;
    }
    
    NSString* UIClassString = [@[@"UI", @"Web", @"Browser", @"View"] componentsJoinedByString:@""];
    NSString* WKClassString = [@[@"WK", @"Content", @"View"] componentsJoinedByString:@""];
    
    Method UIMethod = class_getInstanceMethod(NSClassFromString(UIClassString), @selector(inputAccessoryView));
    Method WKMethod = class_getInstanceMethod(NSClassFromString(WKClassString), @selector(inputAccessoryView));
    
    if (hideFormAccessoryBar) {
        UIOriginalImp = method_getImplementation(UIMethod);
        WKOriginalImp = method_getImplementation(WKMethod);
        
        IMP newImp = imp_implementationWithBlock(^(id _s) {
            return nil;
        });
        
        method_setImplementation(UIMethod, newImp);
        method_setImplementation(WKMethod, newImp);
    } else {
        method_setImplementation(UIMethod, UIOriginalImp);
        method_setImplementation(WKMethod, WKOriginalImp);
    }
    
    _hideFormAccessoryBar = hideFormAccessoryBar;
}


/* ------------------------------------------------------------- */

- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
    [scrollView setContentOffset: CGPointZero];
}

/* ------------------------------------------------------------- */

- (void)dealloc {
    NSNotificationCenter* nc = [NSNotificationCenter defaultCenter];

    [nc removeObserver:self name:UIKeyboardWillShowNotification object:nil];
    [nc removeObserver:self name:UIKeyboardWillHideNotification object:nil];
}

/* ------------------------------------------------------------- */

- (void) disableScrollingInShrinkView:(CDVInvokedUrlCommand*)command {
    if (!command.arguments || ![command.arguments count]){
      return;
    }
    id value = [command.arguments objectAtIndex:0];
    if (value != [NSNull null]) {
      self.disableScroll = [value boolValue];
    }
}

- (void)hideFormAccessoryBar:(CDVInvokedUrlCommand*)command
{
    id value = [command.arguments objectAtIndex:0];
    if (!([value isKindOfClass:[NSNumber class]])) {
        value = [NSNumber numberWithBool:NO];
    }
    
    self.hideFormAccessoryBar = [value boolValue];
}

- (void) close:(CDVInvokedUrlCommand*)command {
    [self.webView endEditing:YES];
}

- (void) show:(CDVInvokedUrlCommand*)command {
    NSLog(@"Showing keyboard not supported in iOS due to platform limitations.");
}


@end
