<div align="center">
  <img margin="auto" width="1000px" src="https://github.com/candlefinance/react-native-openai/assets/12258850/cba19df9-1083-4d43-a291-ffdcd5cf6c7c" alt="Candle / OpenAI">
</div>

<br/>

<div align="center">
  <img alt="npm downloads" src="https://img.shields.io/npm/dw/@candlefinance/react-native-openai?logo=npm&label=NPM%20downloads&cacheSeconds=3600"/>
  <img alt="discord users online" src="https://discord.gg/qnAgjxhg6n" 
  target="_blank"
  />
</div>

<br/>

<h1 align="center">
  Lightweight OpenAI API for React Native (iOS only)
</h1>

## Installation

```sh
yarn add @candlefinance/react-native-openai
```

## Usage

```js
import { multiply } from '@candlefinance/react-native-openai';

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
openAI.stream(e.nativeEvent.text);
```

## Contributing

Join our [Discord](https://discord.gg/qnAgjxhg6n) in #dev channel to chat and ask questions!

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
