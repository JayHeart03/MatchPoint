import React, { useState } from 'react';
import Switch from 'react-switch';
import SpeechRecognition from 'react-speech-recognition';
import "../styles/Sidebar.css"


function VoiceControl() {
  const [isListening, setIsListening] = useState(false);

  const handleToggle = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      SpeechRecognition.startListening({ continuous: true });
      setIsListening(true);
    }
  };

  const customIcons = {
    checked: <i class="bi bi-mic-fill" style={{ margin: '0 0 0 9px' }}></i>,
    unchecked: <i class="bi bi-mic-mute-fill" style={{ margin: '5px 7px 0 4px' }}></i>
    
  };

  return (
    <div>
      <Switch 
        className="button-control"
        onChange={handleToggle}
        checked={isListening}
        checkedIcon={customIcons.checked}
        uncheckedIcon={customIcons.unchecked}
      />
      {isListening && (
        <div className="popup">
          <i className="fas fa-microphone"></i>
        </div>
      )}
    </div>
  );
}

export default VoiceControl;
