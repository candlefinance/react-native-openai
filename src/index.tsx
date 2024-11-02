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
    | 'gpt-4o'
    | 'gpt-4o-2024-08-06'
    | 'gpt-4o-2024-05-13'
    | 'chatgpt-4o-latest'
    | 'gpt-4o-mini'
    | 'gpt-4o-mini-2024-07-18'
    | 'gpt-4o-realtime-preview'
    | 'gpt-4o-realtime-preview-2024-10-01'
    | 'gpt-4o-audio-preview'
    | 'gpt-4o-audio-preview-2024-10-01'
    | 'o1-preview'
    | 'o1-preview-2024-09-12'
    | 'o1-mini'
    | 'o1-mini-2024-09-12'
    | 'gpt-4-turbo'
    | 'gpt-4-turbo-2024-04-09'
    | 'gpt-4-turbo-preview'
    | 'gpt-4-0125-preview'
    | 'gpt-4-1106-preview'
    | 'gpt-4'
    | 'gpt-4-0613'
    | 'gpt-4-0314'
    | 'gpt-3.5-turbo-0125'
    | 'gpt-3.5-turbo'
    | 'gpt-3.5-turbo-1106'
    | 'gpt-3.5-turbo-instruct'
    | 'dall-e-3'
    | 'dall-e-2'
    | 'tts-1'
    | 'tts-1-hd'
    | 'text-embedding-3-large'
    | 'text-embedding-3-small'
    | 'text-embedding-ada-002'
    | 'omni-moderation-latest'
    | 'omni-moderation-2024-09-26'
    | 'text-moderation-latest'
    | 'text-moderation-stable'
    | 'text-moderation-007'
    | 'babbage-002'
    | 'davinci-002'
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
