import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Voice from 'react-native-voice';
import Sound from 'react-native-sound';
import { irregularVerbs } from '../data/irregularVerbs';

const PracticeScreen = () => {
  const [currentVerb, setCurrentVerb] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState('');

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    selectRandomVerb();
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const selectRandomVerb = () => {
    const randomIndex = Math.floor(Math.random() * irregularVerbs.length);
    setCurrentVerb(irregularVerbs[randomIndex]);
  };

  const startListening = async () => {
    try {
      setIsListening(true);
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  const onSpeechResults = (e) => {
    setIsListening(false);
    setResult(e.value[0]);
    checkPronunciation(e.value[0]);
  };

  const checkPronunciation = (spokenWord) => {
    const isCorrect = spokenWord.toLowerCase() === currentVerb.base.toLowerCase();
    // כאן תוכל להוסיף לוגיקה לבדיקת ההגייה ומתן משוב למשתמש
  };

  const playAudio = () => {
    const sound = new Sound(currentVerb.audioUrl, null, (error) => {
      if (error) {
        console.log('שגיאה בטעינת הקובץ', error);
        return;
      }
      sound.play();
    });
  };

  return (
    <View style={styles.container}>
      {currentVerb && (
        <>
          <Text style={styles.verb}>{currentVerb.base}</Text>
          <Text style={styles.translation}>{currentVerb.translation}</Text>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={playAudio}
          >
            <Text style={styles.buttonText}>השמע הגייה</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, isListening && styles.listeningButton]}
            onPress={startListening}
          >
            <Text style={styles.buttonText}>
              {isListening ? 'מקשיב...' : 'לחץ כדי להקליט'}
            </Text>
          </TouchableOpacity>

          {result && (
            <Text style={styles.result}>המילה שאמרת: {result}</Text>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  verb: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  translation: {
    fontSize: 24,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    marginVertical: 10,
  },
  listeningButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  result: {
    fontSize: 18,
    marginTop: 20,
  },
});

export default PracticeScreen; 