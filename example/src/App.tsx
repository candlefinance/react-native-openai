import * as React from 'react';

import OpenAI from 'react-native-openai';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function App() {
  const [result, setResult] = React.useState<string>('');
  const ai = React.useMemo(() => new OpenAI('', ''), []);

  React.useEffect(() => {
    ai.addListener('onMessageReceived', (event) => {
      console.log(event);
      setResult((message) => message + event.payload?.message);
    });

    return () => {
      ai.removeListener('onMessageReceived');
    };
  }, [ai]);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Ask me a question."
        onEndEditing={(e) => {
          console.log(e.nativeEvent.text);
          ai.createCompletion(e.nativeEvent.text);
        }}
        style={styles.input}
      />
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  input: {
    width: 300,
    height: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
  },
});
