import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

export type Config =
  | {
      apiKey: string;
      organization: string;
    }
  | {
      apiKey?: string;
      organization?: string;
      scheme?: string;
      host: string;
      pathPrefix?: string;
    };

class OpenAI {
  module = NativeModules.ReactNativeOpenai;
  private bridge: NativeEventEmitter;
  public chat: Chat;
  public image: Image;

  public constructor(config: Config) {
    this.bridge = new NativeEventEmitter(this.module);
    this.module.initialize(config);
    this.chat = new Chat(this.module, this.bridge);
    this.image = new Image(this.module);
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

  type FinishReason = 'length' | 'stop' | 'content_filter';

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
      finishReason: FinishReason;
    }[];
  };

  type Usage = {
    promptTokens: number;
    completionTokens?: number;
    totalTokens: number;
  };

  type Choice = {
    index: number;
    message: Message;
    finishReason: FinishReason;
  };

  export type CreateOutput = {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Choice[];
    usage: Usage;
  };
}

namespace ImageModels {
  type ImageSize = '256x256' | '512x512' | '1024x1024';

  export type ImageInput = {
    prompt: string;
    n?: number;
    size?: ImageSize;
  };

  type Image = {
    url: string;
  };

  export type ImageOutput = {
    created: Date;
    data: Image[];
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

  public async create(
    input: ChatModels.StreamInput
  ): Promise<ChatModels.CreateOutput> {
    const result = await this.module.create(input);
    if (Platform.OS === 'ios') {
      return JSON.parse(result);
    }
    return result;
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

class Image {
  private module: any;

  public constructor(module: any) {
    this.module = module;
  }

  public async create(
    input: ImageModels.ImageInput
  ): Promise<ImageModels.ImageOutput> {
    const result = await this.module.imageCreate(input);
    if (Platform.OS === 'ios') {
      return JSON.parse(result);
    }
    return result;
  }
}

export default OpenAI;
