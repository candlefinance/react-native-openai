import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package '@candlefinance/react-native-openai' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ReactNativeOpenAI = NativeModules.ReactNativeOpenai
  ? NativeModules.ReactNativeOpenai
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export type EventTypes = 'onMessageReceived';

class OpenAI {
  private bridge: NativeEventEmitter;

  public constructor(apiKey: string, organization: string) {
    this.bridge = new NativeEventEmitter(ReactNativeOpenAI);
    ReactNativeOpenAI.initialize(apiKey, organization);
  }

  public stream(prompt: string) {
    return ReactNativeOpenAI.stream(prompt);
  }

  public addListener(
    event: EventTypes,
    callback: (event: { payload: { message: string } }) => void
  ) {
    this.bridge.addListener(event, callback);
  }

  public removeListener(event: EventTypes) {
    this.bridge.removeAllListeners(event);
  }
}

export default OpenAI;
