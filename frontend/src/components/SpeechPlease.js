import React, { useState } from 'react';
import useSpeechSynthesis from '../components/speech';

function useSpeech() {
  const [isEnabled, setIsEnabled] = useState(false);
  const { speak, cancel, speaking } = useSpeechSynthesis(isEnabled);

  const handleWordHover = (event) => {
    const word = event.target.innerText;
    speak(word);
  };

  const handleToggleSwitch = () => {
    setIsEnabled((prevEnabled) => !prevEnabled);
    cancel();
  };

  return {
    isEnabled,
    handleWordHover,
    handleToggleSwitch,
  };
}

export default useSpeech;



