#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(ReactNativeOpenai, RCTEventEmitter)

// API
RCT_EXTERN_METHOD(supportedEvents)
RCT_EXTERN_METHOD(initialize:(NSDictionary *)config)

// Chat
RCT_EXTERN_METHOD(stream:(NSDictionary *)input)
RCT_EXTERN_METHOD(create:(NSDictionary *)input withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

// Image
RCT_EXTERN_METHOD(imageCreate:(NSDictionary *)input withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)


+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end
