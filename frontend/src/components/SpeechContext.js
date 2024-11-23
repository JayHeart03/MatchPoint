import React, { createContext, useState } from 'react';

const SpeechContext = createContext();

function SpeechProvider(props) {
  const [isEnabled, setIsEnabled] = useState(false);

  const handleToggleSwitch = () => {
    setIsEnabled(!isEnabled);
  };

  return (
    <SpeechContext.Provider value={{ isEnabled, handleToggleSwitch }}>
      {props.children}
    </SpeechContext.Provider>
  );
}

export { SpeechContext, SpeechProvider };
