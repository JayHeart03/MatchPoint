import React, { useState, useContext } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/CreateGame.css";
import logoDark from "../assets/image.png";
import useSpeechSynthesis from '../components/speech';
import EnableSpeechSwitch from '../components/SpeechContext'
import useSpeech from '../components/SpeechPlease';
import SpeechContext from '../components/SpeechWhy';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import Switch from 'react-switch';
import DarkMode from '../components/DarkMode';
import ControlButton from '../components/controlButton';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {FaBars, FaTimes} from 'react-icons/fa'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'




const token = localStorage.getItem('token');
console.log(token);
const CreateGame = () => {
  const [sessionTitle, setSessionTitle] = useState("");
  const [sportChoice, setSportChoice] = useState("");
  const [numConfirmedPlayers, setNumConfirmedPlayers] = useState("");
  const [skillRating, setSkillRating] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [gameDescription, setGameDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  // const [organisation, setorganisation] = useState("");
  // const [image, setImage] = useState("");


  const handleSubmit = (event) => {
    event.preventDefault();
    if (!sessionTitle || !sportChoice || !numConfirmedPlayers || !skillRating || !ageRange || !gameDescription || !date || !startTime || !endTime || !location) {
      alert('Please fill in all fields');
      return;
    }

    axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`)
      .then(response => {
        const latitude = parseFloat(response.data[0].lat);
        const longitude = parseFloat(response.data[0].lon);
  

    const payload = {
      session_title: sessionTitle,
      sport: sportChoice,
      confirmed_players: numConfirmedPlayers,
      skill_rating: skillRating,
      age_range: ageRange,
      game_description: gameDescription,
      date: date,
      start_time: startTime,
      end_time: endTime,
      location: location,
      location_latitude: latitude,
      location_longitude: longitude,
      //status: "Not_Started",
      // organisation : organisation ,
      // image:image,

    };


    fetch('https://matchpoint.games/api/games/create/', {

      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`

      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        const gameid = data.game_id;
        window.location.href = `https://matchpoint.games/GameLobby/${gameid}`;
      })
      .catch(error => {
        console.error('Error:', error);
      });
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error finding location. Please try again.');
    });
  };

  const [fontSize, setFontSize] = useState(16);
  const [fontSizeh, setFontSizeh3] = useState(35);

  const { isEnabled, handleWordHover, handleToggleSwitch } = useSpeech();

  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click)



  

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
    <div>
      
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

                    <NavDropdown.Item  onMouseOver={handleWordHover} className='item' onClick={handleLogout}>Log out</NavDropdown.Item>
                   
                  </NavDropdown>
            </ul>
            <div className='burger' onClick={handleClick}>
                {click ? (<FaTimes size ={20} style ={{color: '#fff'}} />) : (<FaBars size ={20} style ={{color: '#fff'}}/>)}
                
            </div>
          

        </div>
      <div className='create-main'>
        <div className='hero-create'>
          <div className='content-create'>
            <h1 ><img src={logoDark} alt="Match Point" className="Logo-home" /></h1>
            <button onMouseOver={handleWordHover} className="in-button" onClick={() => {
              setFontSize(fontSize + 2);
              setFontSizeh3(fontSizeh + 2);
            }}>
              + Increase
            </button>
            <button onMouseOver={handleWordHover} className="in-button" onClick={() => {
              setFontSize(fontSize - 2);
              setFontSizeh3(fontSizeh - 2);
            }}>
              - Decrease
            </button>
            <h3 style={{ fontSize: `${fontSizeh}px` }} className="creategame">Create Game</h3>
            <form className='create-form' onSubmit={handleSubmit}>


              <div className="create-game-why">
                <div className="left-side-create">
                  <div className="create-in-con">
                    <label  onMouseOver={handleWordHover} style={{ fontSize: `${fontSize}px` }} className='create-la'>Session Title:</label>
                    <input  onMouseOver={handleWordHover} style={{ fontSize: `${fontSize}px` }} className="create-in" type="text" value={sessionTitle} onChange={(event) => setSessionTitle(event.target.value)} placeholder="Session Title " />
                  </div>










                  <div style={{ fontSize: `${fontSize}px` }} className="create-in-con">
                    <label onMouseOver={handleWordHover}className='create-la'>Start Time:</label>
                    <input onMouseOver={handleWordHover} style={{ fontSize: `${fontSize}px` }} className="create-in" type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} placeholder="startTime" />

                  </div>









                  <div className="create-in-con">
                    <label onMouseOver={handleWordHover} style={{ fontSize: `${fontSize}px` }} className='create-la'>Number of Players:</label>
                    <input onMouseOver={handleWordHover} style={{ fontSize: `${fontSize}px` }} className="create-in" type="number" value={numConfirmedPlayers} onChange={(event) => setNumConfirmedPlayers(event.target.value)} placeholder="Confirmed Players" />
                  </div>

                  <div className="create-in-con">
                    <label onMouseOver={handleWordHover} style={{ fontSize: `${fontSize}px` }} className='create-la'>Skill Rating:</label>
                    <select onMouseOver={handleWordHover} style={{ fontSize: `${fontSize}px` }} className="create-in" value={skillRating} onChange={(event) => setSkillRating(event.target.value)}>
                      <option onMouseOver={handleWordHover} value="">Select rating:</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Lower Intermediate">Lower Intermediate</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Upper Intermediate">Upper Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>



                  <div className="create-in-con">
                    <label onMouseOver={handleWordHover} style={{ fontSize: `${fontSize}px` }} className='create-la'>Age Range</label>
                    <select onMouseOver={handleWordHover} style={{ fontSize: `${fontSize}px` }} className="create-in" value={ageRange} onChange={(event) => setAgeRange(event.target.value)}>
                      <option value="">Select Age:</option>
                      <option value="18-25">18-25</option>
                      <option value="26-35">26-35</option>
                      <option value="36-45">36-45</option>
                      <option value="46-55">46-55</option>
                      <option value="56-65">56-65</option>
                      <option value="Over 65">Over 65</option>
                    </select>
                  </div>
                </div>











                <div className="right-side-create">
                  <div style={{ fontSize: `${fontSize}px` }} className="create-in-con">
                    <label onMouseOver={handleWordHover} className='create-la'>Game Description:</label>
                    <input onMouseOver={handleWordHover} style={{ fontSize: `${fontSize}px` }} className="create-in" value={gameDescription} onChange={(event) => setGameDescription(event.target.value)} placeholder="Game Description" />
                  </div>



                  <div style={{ fontSize: `${fontSize}px` }} className="create-in-con">
                    <label onMouseOver={handleWordHover} className='create-la'>End Time:</label>
                    <input onMouseOver={handleWordHover} style={{ fontSize: `${fontSize}px` }} className="create-in" type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} placeholder="endTime" />

                  </div>








                  <div style={{ fontSize: `${fontSize}px` }} className="create-in-con">
                    <label onMouseOver={handleWordHover} className='create-la'>Date:</label>
                    <input onMouseOver={handleWordHover} style={{ fontSize: `${fontSize}px` }} className="create-in" type="date" value={date} onChange={(event) => setDate(event.target.value)} placeholder="Date" />

                  </div>




                  <div style={{ fontSize: `${fontSize}px` }} className="create-in-con">
                    <label onMouseOver={handleWordHover} className='create-la'>Location:</label>
                    <input onMouseOver={handleWordHover} style={{ fontSize: `${fontSize}px` }} className="create-in" type="text" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Location" />

                  </div>
                  <div className="create-in-con">
                    <label onMouseOver={handleWordHover} style={{ fontSize: `${fontSize}px` }} className='create-la'>Sport of Choice:</label>
                    <select onMouseOver={handleWordHover} style={{ fontSize: `${fontSize}px` }} className="create-in" value={sportChoice} onChange={(event) => setSportChoice(event.target.value)}>
                      <option value="NoChoice">Select Sport</option>
                      <option value="Cricket">Cricket</option>
                      <option value="Football">Football</option>
                      <option value="Volleyball">Volleyball</option>
                      <option value="Field Hockey">Field Hockey</option>
                      <option value="Tennis">Tennis</option>
                      <option value="Basketball">Basketball</option>
                      <option value="Table Tennis">Table Tennis</option>
                      <option value="Baseball">Baseball</option>
                      <option value="Golf">Golf</option>
                      <option value="Rugby">Rugby</option>
                      <option value="Badminton">Badminton</option>
                      <option value="American Football">American Football</option>
                      <option value="Swimming">Swimming</option>
                      <option value="Gymnastics">Gymnastics</option>
                      <option value="Cycling">Cycling</option>
                      <option value="Ice Hockey">Ice Hockey</option>
                      <option value="Handball">Handball</option>
                      <option value="Bowling">Bowling</option>
                      <option value="Rock Climbing">Rock Climbing</option>
                      <option value="Frisbee">Frisbee</option>
                    </select>
                  </div>
                </div>
              </div>





              <div className="create-game-button">
                <button onMouseOver={handleWordHover} onClick={handleSubmit} style={{ fontSize: `${fontSize}px` }} className="create-button" type="submit"> Create Game</button>
              </div>




            </form>
          </div>
        </div>



      </div>
    </div>
  );
};

export default CreateGame;











