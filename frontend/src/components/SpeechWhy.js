import React from 'react';

const SpeechContext = React.createContext({
  isEnabled: false,
  handleToggleSwitch: () => {},
});

export default SpeechContext;
