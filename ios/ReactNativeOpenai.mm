#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(ReactNativeOpenai, RCTEventEmitter)

RCT_EXTERN_METHOD(supportedEvents)
RCT_EXTERN_METHOD(stream:(NSDictionary *)input)
RCT_EXTERN_METHOD(initialize:(NSString *)apiKey organization:(NSString *)organization)

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end
