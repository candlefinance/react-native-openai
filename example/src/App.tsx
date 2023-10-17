import * as React from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import OpenAI from 'react-native-openai';

export default function App() {
  const scheme = useColorScheme();
  const [result, setResult] = React.useState<string>('');
  const openAI = React.useMemo(() => new OpenAI('', ''), []);

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

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: scheme === 'dark' ? 'black' : 'white' },
      ]}
    >
      <TextInput
        placeholder="Ask me a question."
        onEndEditing={async (e) => {
          console.log(e.nativeEvent.text);
          openAI.chat.stream({
            messages: [
              {
                role: 'user',
                content: e.nativeEvent.text,
              },
            ],
            model: 'gpt-3.5-turbo',
          });
        }}
        style={[
          styles.input,
          {
            color: scheme === 'dark' ? 'white' : 'black',
            backgroundColor: scheme === 'dark' ? 'black' : 'white',
          },
        ]}
      />
      <Text style={{ color: scheme === 'dark' ? 'white' : 'black' }}>
        Result: {result}
      </Text>
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
