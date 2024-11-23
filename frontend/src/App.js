import './App.css';
import Sidebar from './components/Sidebar';
import React, {useState} from 'react';
import {
  BrowserRouter,
  Link,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import HomePage from './pages/HomePage';
import CreateGame from './pages/CreateGame';
import Privacy from './components/Privacy';
import ContactUs from './components/ContactUs';
import JoinGame from './pages/JoinGame';
import ViewProfile from './pages/ViewProfile';
import Stats from './pages/Stats';
import FriendStats from './pages/FriendStats';
import Social from './pages/Social';
import GameLobby from './pages/GameLobby'
import CreateAccount from './components/CreateAccount';
import RatingPopup from './components/RatingPopup'; //added this line for the rating.js, remove it after incorporating rating into create game
import PasswordAcceptForm from "./components/PasswordAcceptForm";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition"
import ControlButton from './components/controlButton';
import SpeechContext from '../src/components/SpeechWhy';

function App() {
  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
}

const [isEnabled, setIsEnabled] = useState(false);

const handleToggleSwitch = () => {
  setIsEnabled((prevEnabled) => !prevEnabled);
};

const handleMouseOver = (event) => {
    const text = event.target.textContent;
    speak(text);
}
  const commands = [
    {
      command: ["Go to *", "open *"],
      callback:(redirectPage) => navigateToPage(redirectPage),
    },
  ];

  const {transcript} = useSpeechRecognition({commands});
  const navigate = useNavigate();

  const navigateToPage = (page) => {
    const urls = {
      "create game" :"/creategame",
      "join game": "/joingame",
      "view profile": "/viewprofile",
      stats: "/stats",
      social: "/social"
    };
    
    if (Object.keys(urls).includes(page)) {
      navigate(urls[page]);
    } else {
      console.log(`Could not find page: ${page}`);
    }
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition){
    return null;
  }

  return (
    <>
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/homepage' element={<HomePage />} />
      <Route path='/PasswordAcceptForm' element={<PasswordAcceptForm />} />
      <Route path='/creategame' element={<CreateGame />} />
      <Route path='/rate' element={<RatingPopup />} />
      <Route path='/policy' element={<Privacy />} />
      <Route path='/contactus' element={<ContactUs />} />
      <Route path='/joingame' element={<JoinGame />} />
      <Route path='/viewprofile' element={<ViewProfile />} />
      <Route path='/stats' element={<Stats />} />
      <Route path='/friendstats/:user_id' element={<FriendStats />} />
      <Route path='/social' element={<Social />} />
      <Route path="/GameLobby/:id" element={ <GameLobby />} />
      <Route path='/createaccount' element={<CreateAccount />} />
      

      
    </Routes>
    </>
  );
}

export default App;
