import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {FaBars, FaTimes} from 'react-icons/fa'
import '../styles/Sidebar.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
    Routes,
    BrowserRouter,
  } from "react-router-dom";
import CreateGame from '../pages/CreateGame';
import JoinGame from '../pages/JoinGame';
import Social from '../pages/Social';
import HomePage from '../pages/HomePage';
import Stats from '../pages/Stats';
import ViewProfile from '../pages/ViewProfile';
import logoLight from "../assets/logo.png";
import logoDark from "../assets/greylogo.png";
import "../styles/Sidebar.css"
import DarkMode from './DarkMode';
import ControlButton from '../components/controlButton';
import Switch from 'react-switch';
import useSpeechSynthesis from '../components/speech';
import EnableSpeechSwitch from './SpeechContext'
import useSpeech from '../components/SpeechPlease';
import { SpeechContext } from '../components/SpeechContext';



// Use isMouseOverEnabled here









function Sidebar() {
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click)


    const { isEnabled, handleWordHover, handleToggleSwitch } = useSpeech();

    

    const [darkMode, setDarkMode] = useState(false);
    function toggleDarkMode() {
      setDarkMode(!darkMode);
      const html = document.querySelector('html');
      html.classList.toggle('dark');
    }
  
    const handleLogout = () => {
      // Delete token from local storage
      localStorage.removeItem('token');
  
      // Redirect to login page
      window.location.href = '/homepage';
    };

        const customIcons = {
      checked: <i class="bi bi-volume-up-fill" style={{ margin: '0 0 0 6px', fontSize: '20px' }}></i>,
      unchecked: <i class="bi bi-volume-mute-fill" style={{ margin: '2px 7px 0 4px', fontSize: '20px' }}></i>,
      
    };
  
    return (

      <div className="header">
        <div className="logo-holder">
          <Link className="logo-bar">
            <img src={logoDark} alt="Match Point" className="Logo" />
          </Link>
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li>
          
          
          <Switch className='hello'
      checked={isEnabled}
      onChange={handleToggleSwitch}

      name="enableSpeechSynthesis"
      inputProps={{ 'aria-label': 'Enable speech synthesis' }}
              checkedIcon={customIcons.checked}
        uncheckedIcon={customIcons.unchecked}
    />
          </li>
          <li>
            <DarkMode/>
          </li>
          <li>
            <ControlButton/>
          </li>
          <li>
            
            <Link to="/creategame" onMouseOver={handleWordHover} >
              Create Game
            </Link>
          </li>
          <li>
            <Link to="/joingame" onMouseOver={handleWordHover}>
              Join Game
            </Link>
          </li>
          <li>
            <Link to="/viewprofile" onMouseOver={handleWordHover} >
              View Profile
            </Link>
          </li>
          <li>
            <Link to="/stats"  onMouseOver={handleWordHover}>
              Stats
            </Link>
          </li>
          <li>
            <Link to="/social" onMouseOver={handleWordHover}>
              Social
            </Link>
          </li>
          <NavDropdown  className="drop" title="More">
            <NavDropdown.Item className="item" onMouseOver={handleWordHover}>
              Settings
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item className="item" onMouseOver={handleWordHover}>
              Help
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onMouseOver={handleWordHover}
              
              className="item"
              onClick={toggleDarkMode}
            >
              {darkMode ? 'Light UI' : 'Dark UI'}
            </NavDropdown.Item>
            <NavDropdown.Divider />
                    <NavDropdown.Item  onMouseOver={handleWordHover} className='item' onClick={handleLogout}>Log out</NavDropdown.Item>
                   
                  </NavDropdown>
            </ul>
            <div className='burger' onClick={handleClick}>
                {click ? (<FaTimes size ={20} style ={{color: '#fff'}} />) : (<FaBars size ={20} style ={{color: '#fff'}}/>)}
                
            </div>
          

        </div>
      
    );
  }
;

  
  export default Sidebar;

