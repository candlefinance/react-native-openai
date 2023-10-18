import * as React from 'react';

import {
  Animated,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
} from 'react-native';
import OpenAI from 'react-native-openai';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function App() {
  const scheme = useColorScheme();
  const [result, setResult] = React.useState<string>('');
  const openAI = React.useMemo(() => new OpenAI('', ''), []);

  const yPosition = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      console.log(e);
      Animated.timing(yPosition, {
        toValue: Platform.OS === 'ios' ? -e.endCoordinates.height + 16 : 0,
        duration: Platform.OS === 'ios' ? 0 : 250,
        useNativeDriver: true,
      }).start();
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(yPosition, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

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
      <Animated.View
        style={{
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 16 : 0,
          paddingVertical: 14,
          width: '100%',
          zIndex: 1,
          backgroundColor: '#f0f0f3',
          transform: [
            {
              translateY: yPosition,
            },
          ],
        }}
      >
        <AnimatedTextInput
          placeholder="Ask AI..."
          autoFocus
          clearTextOnFocus
          onEndEditing={async (e) => {
            if (!e.nativeEvent.text || e.nativeEvent.text === '') {
              return;
            }
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
      </Animated.View>
      <ScrollView
        style={{ width: '100%', backgroundColor: 'transparent' }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 75,
          backgroundColor: 'transparent',
        }}
      >
        <Text
          style={{
            fontSize: 17,
            color: scheme === 'dark' ? 'white' : 'black',
            alignSelf: 'flex-start',
          }}
        >
          Result: {result}
        </Text>
      </ScrollView>
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
    width: '95%',
    height: 50,
    backgroundColor: '#ffffff',
    zIndex: 1,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    borderRadius: 16,
    borderCurve: 'continuous',
    fontSize: 17,
    padding: 10,
    alignSelf: 'center',
  },
});
