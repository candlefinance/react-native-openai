<div align="center">
  <img margin="auto" width="1000px" src="https://github.com/candlefinance/react-native-openai/assets/12258850/cba19df9-1083-4d43-a291-ffdcd5cf6c7c" alt="Candle / OpenAI">
</div>

<br/>

<div align="center">
  <img alt="npm downloads" src="https://img.shields.io/npm/dw/@candlefinance/react-native-openai?logo=npm&label=NPM%20downloads&cacheSeconds=3600"/>
  <a alt="discord users online" href="https://discord.gg/qnAgjxhg6n" 
  target="_blank"
  rel="noopener noreferrer">
    <img alt="discord users online" src="https://img.shields.io/discord/986610142768406548?label=Discord&logo=discord&logoColor=white&cacheSeconds=3600"/>
</div>

<br/>

<h1 align="center">
  Lightweight OpenAI API for React Native
</h1>

<br/>

Currently, this library only supports the [Chat](https://platform.openai.com/docs/api-reference/chat) API. We are working on adding support for the other APIs. If you would like to contribute, please join our [Discord](https://discord.gg/qnAgjxhg6n) and ask questions in the **#oss** channel or create a pull request.

The goal is to make this library take advantage of the native APIs like URLSession and Android's Ktor engine for better performance and reliability.

## Features

- [x] [Chat](https://platform.openai.com/docs/api-reference/chat)
- [ ] [Models](https://beta.openai.com/docs/api-reference/models)
- [ ] [Completions](https://beta.openai.com/docs/api-reference/completions)
- [ ] [Edits](https://beta.openai.com/docs/api-reference/edits)
- [ ] [Images](https://beta.openai.com/docs/api-reference/images)
- [ ] [Embeddings](https://beta.openai.com/docs/api-reference/embeddings)
- [ ] [Files](https://beta.openai.com/docs/api-reference/files)
- [ ] [Moderations](https://beta.openai.com/docs/api-reference/moderations)
- [ ] [Fine-tunes](https://beta.openai.com/docs/api-reference/fine-tunes)
- [ ] [Speech to text](https://platform.openai.com/docs/guides/speech-to-text)
- [ ] [Function calling](https://platform.openai.com/docs/guides/gpt/function-calling)

## Installation

```sh
yarn add react-native-openai
```

## Basic Usage

1. Create a new OpenAI instance with your API key and organization ID.
2. Call `stream` with your messages to generate a streaming completion.
3. Check out the documentation for more information on the available methods.

```js
import OpenAI from 'react-native-openai';

const openAI = new OpenAI('API_KEY', 'ORG_ID');

const [result, setResult] = React.useState('');

React.useEffect(() => {
 openAI.chat.addListener('onChatMessageReceived', (payload) => {
   setResult((message) => {
     const newMessage = payload.choices[0]?.delta.content;
     if (newMessage) {
       return message + newMessage;
     }
     return message;
   });
 });

 return () => {
   openAI.chat.removeListener('onChatMessageReceived');
 };
  }, [openAI]);

// Create a new completion
func ask(question: string) {
   openAI.chat.stream({
      messages: [
        {
          role: 'user',
          content: question,
        },
      ],
      model: 'gpt-3.5-turbo',
  });
}
```

## Credit

Thank you to Dylan Shine & Mouaad Aallam for making [openai-kit](https://github.com/dylanshine/openai-kit) and [openai-kotlin](https://github.com/aallam/openai-kotlin) which this library is based on.

## License

MIT
