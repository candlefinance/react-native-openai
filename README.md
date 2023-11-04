https://github.com/candlefinance/react-native-openai/assets/12258850/44a496dc-68bc-44ee-9224-07c302121e94

<br/>
<div align="center">
  <a alt="npm" href="https://www.npmjs.com/package/react-native-openai">
      <img alt="npm downloads" src="https://img.shields.io/npm/dm/%40candlefinance%2Freact-native-openai.svg"/>
  </a>
  <a alt="discord users online" href="https://discord.gg/qnAgjxhg6n" 
  target="_blank"
  rel="noopener noreferrer">
    <img alt="discord users online" src="https://img.shields.io/discord/986610142768406548?label=Discord&logo=discord&logoColor=white&cacheSeconds=3600"/>
</div>

<br/>

<h1 align="center">
 OpenAI for React Native
</h1>

<br/>

The goal is to make this library take advantage of the native APIs like URLSession and Android's Ktor engine for better performance and reliability.

If you would like to contribute, please join our [Discord](https://discord.gg/qnAgjxhg6n) and ask questions in the **#oss** channel or create a pull request.

## Features

- [x] [Chat](https://platform.openai.com/docs/api-reference/chat)
- [ ] [Models](https://beta.openai.com/docs/api-reference/models)
- [ ] [Completions](https://beta.openai.com/docs/api-reference/completions)
- [ ] [Edits](https://beta.openai.com/docs/api-reference/edits)
- [x] [Images](https://beta.openai.com/docs/api-reference/images)
- [ ] [Embeddings](https://beta.openai.com/docs/api-reference/embeddings)
- [ ] [Files](https://beta.openai.com/docs/api-reference/files)
- [ ] [Moderations](https://beta.openai.com/docs/api-reference/moderations)
- [ ] [Fine-tunes](https://beta.openai.com/docs/api-reference/fine-tunes)
- [ ] [Speech to text](https://platform.openai.com/docs/guides/speech-to-text)
- [ ] [Function calling](https://platform.openai.com/docs/guides/gpt/function-calling)

## Installation

Requires `iOS 15+` and Android `minSdkVersion = 24`.

```sh
yarn add react-native-openai
```

### Basic Usage

```js
import OpenAI from 'react-native-openai';

const openAI = new OpenAI({
  apiKey: 'YOUR_API_KEY',
  organization: 'YOUR_ORGANIZATION',
});

// Alternatively (recommended), you can use your own backend and not hardcode an API key in your app i.e. https://my-custom-domain.com/v1/chat/completions (follow the same API as OpenAI until pathPrefix is fixed on Android)
const openAI = new OpenAI({
  host: 'my-custom-host.com',
});
```

### Chat API

```js
const [result, setResult] = React.useState('');

// Listen for messages
openAI.chat.addListener('onChatMessageReceived', (payload) => {
  setResult((message) => {
    const newMessage = payload.choices[0]?.delta.content;
    if (newMessage) {
      return message + newMessage;
    }
    return message;
  });
});

// Send a message
openAI.chat.stream({
  messages: [
    {
      role: 'user',
      content: 'How do I star a repo?',
    },
  ],
  model: 'gpt-3.5-turbo',
});

// Alternatively, you can use the create method if `stream` is false
await openAI.chat.create(...)
```

### Image API

```js
const result = await openAI.image.create({
  prompt: 'An awesome Candle logo',
  n: 3,
  size: '512x512',
});

setImages(result.data.map((image) => image.url));
```

## Credit

Thank you to Dylan Shine & Mouaad Aallam for making [openai-kit](https://github.com/dylanshine/openai-kit) and [openai-kotlin](https://github.com/aallam/openai-kotlin) which this library is based on.

## License

MIT
