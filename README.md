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

Currently the project only supports iOS using URLSession for faster performance. Android support is [coming soon](https://github.com/candlefinance/react-native-openai/issues/1).

## Features

- [x] [Chat](https://platform.openai.com/docs/api-reference/chat)
- [x] [Models](https://beta.openai.com/docs/api-reference/models)
- [x] [Completions](https://beta.openai.com/docs/api-reference/completions)
- [x] [Edits](https://beta.openai.com/docs/api-reference/edits)
- [x] [Images](https://beta.openai.com/docs/api-reference/images)
- [x] [Embeddings](https://beta.openai.com/docs/api-reference/embeddings)
- [x] [Files](https://beta.openai.com/docs/api-reference/files)
- [x] [Moderations](https://beta.openai.com/docs/api-reference/moderations)
- [ ] [Fine-tunes](https://beta.openai.com/docs/api-reference/fine-tunes)
- [x] [Speech to text](https://platform.openai.com/docs/guides/speech-to-text)
- [ ] [Function calling](https://platform.openai.com/docs/guides/gpt/function-calling)

## Installation

```sh
yarn add react-native-openai
```

## Basic Usage

1. Create a new OpenAI instance with your API key and organization ID.
2. Call `createCompletion` with your prompt to generate a streaming completion.
3. Check out the documentation for more information on the available methods.

```js
import OpenAI from 'react-native-openai';

const openAI = new OpenAI('API_KEY', 'ORG_ID');

const [result, setResult] = React.useState('');

React.useEffect(() => {
  openAI.addListener('onMessageReceived', (event) => {
    setResult((message) => message + event.payload.message);
  });

  return () => {
    openAI.removeListener('onMessageReceived');
  };
}, []);

// Create a new completion
func ask(question: string) {
  openAI.createCompletion(question);
}
```

## Contributing

Join our [Discord](https://discord.gg/qnAgjxhg6n) and ask questions in the **#dev** channel.

## License

MIT
