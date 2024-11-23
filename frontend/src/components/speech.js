import { useState, useEffect } from 'react';

const useSpeechSynthesis = (isEnabled) => {
  const [voices, setVoices] = useState([]);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setVoices(voices);
    };

    loadVoices();

    if (typeof window !== 'undefined' && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = (text) => {
    if (isEnabled) {
      const message = new SpeechSynthesisUtterance(text);
      const voice = voices.find((voice) => voice.lang === 'en-US');

      message.voice = voice;
      message.volume = 1;
      message.pitch = 1;
      message.rate = 1;
      message.onstart = () => setSpeaking(true);
      message.onend = () => setSpeaking(false);

      window.speechSynthesis.speak(message);
    }
  };

  const cancel = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return { speak, cancel, speaking };
};

export default useSpeechSynthesis;
