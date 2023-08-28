import { NativeEventEmitter, NativeModules } from 'react-native';

class OpenAI {
  module = NativeModules.ReactNativeOpenai;
  private bridge: NativeEventEmitter;
  public chat: Chat;

  public constructor(apiKey: string, organization: string) {
    this.bridge = new NativeEventEmitter(this.module);
    this.module.initialize(apiKey, organization);
    this.chat = new Chat(this.module, this.bridge);
  }
}

namespace ChatModels {
  type Model =
    | 'gpt-4'
    | 'gpt-4-0314'
    | 'gpt-4-32k'
    | 'gpt-4-32k-0314'
    | 'gpt-3.5-turbo'
    | 'gpt-3.5-turbo-16k'
    | 'gpt-3.5-turbo-0301'
    | 'text-davinci-003'
    | 'text-davinci-002'
    | 'text-curie-001'
    | 'text-babbage-001'
    | 'text-ada-001'
    | 'text-embedding-ada-002'
    | 'text-davinci-001'
    | 'text-davinci-edit-001'
    | 'davinci-instruct-beta'
    | 'davinci'
    | 'curie-instruct-beta'
    | 'curie'
    | 'ada'
    | 'babbage'
    | 'code-davinci-002'
    | 'code-cushman-001'
    | 'code-davinci-001'
    | 'code-davinci-edit-001'
    | 'whisper-1';

  type Message = {
    role: 'user' | 'system' | 'assistant';
    content: string;
  };

  export type StreamInput = {
    model: Model;
    messages: Message[];
    temperature?: number;
    topP?: number;
    n?: number;
    stops?: string[];
    maxTokens?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
    logitBias?: { [key: string]: number };
    user?: string;
  };

  export type StreamOutput = {
    id: string;
    object: string;
    created: number;
    model: Model;
    choices: {
      delta: {
        content?: string;
        role?: string;
      };
      index: number;
      finishReason: 'length' | 'stop' | 'content_filter';
    }[];
  };
}

class Chat {
  private bridge: NativeEventEmitter;
  private module: any;

  public constructor(module: any, bridge: NativeEventEmitter) {
    this.module = module;
    this.bridge = bridge;
  }

  public stream(input: ChatModels.StreamInput) {
    return this.module.stream(input);
  }

  public addListener(
    event: 'onChatMessageReceived',
    callback: (event: ChatModels.StreamOutput) => void
  ) {
    this.bridge.addListener(event, (value) => {
      const payload = JSON.parse(value.payload);
      callback(payload);
    });
  }

  public removeListener(event: 'onChatMessageReceived') {
    this.bridge.removeAllListeners(event);
  }
}

export default OpenAI;
