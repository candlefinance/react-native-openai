import * as React from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
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
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: scheme === 'dark' ? 'black' : 'white' },
      ]}
    >
      <TextInput
        placeholder="Ask me a question."
        autoFocus
        clearTextOnFocus
        onEndEditing={async (e) => {
          setResult('');
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
      <Text
        style={{
          marginHorizontal: 16,
          fontSize: 17,
          color: scheme === 'dark' ? 'white' : 'black',
          alignSelf: 'flex-start',
        }}
      >
        Result: {result}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: 24,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 16,
    borderCurve: 'continuous',
    fontSize: 17,
    padding: 10,
  },
});
