import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Router } from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import '../styles/Stats.css'
import Sidebar from '../components/Sidebar';
import profileTest from "../assets/profile.png";
import { FaUserCircle, FaUserFriends, FaCheck, FaTimes,FaBars} from 'react-icons/fa';
import logoDark from "../assets/logo.png";
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import useSpeech from '../components/SpeechPlease';
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
import 'bootstrap/dist/css/bootstrap.min.css';


function Stats() {

  const [imageSrc, setImageSrc] = useState(null);

function handleImageUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    setImageSrc(event.target.result);
  };

  reader.readAsDataURL(file);
}

const [selectedOption, setSelectedOption] = useState('allTime');

const handleOptionClick = (option) => {
  setSelectedOption(option);
}


const [pregames, sePreGames] = useState([]);
useEffect(() => {
  const token = localStorage.getItem('token');
  fetch('https://matchpoint.games/api/pregames', {
    headers: {
      'Authorization': `Token ${token}`
    }
  })
    .then(response => response.json())
    .then(data => sePreGames(data));
}, []);


const renderStatsText = () => {
  if (selectedOption === '7Days') {
    const gamesLastWeek = pregames.games_last_week || [];
    const gamesCount = gamesLastWeek.length;
    return gamesCount ? (
      <div onMouseOver={handleWordHover} className="past-games-container">
        {gamesLastWeek.map((game) => (
          <div onMouseOver={handleWordHover} key={game.id} className="past-games">
            <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover}>Title: {game.name}</p>
            <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover}>Sport: {game.sport}</p>
            <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover}>Date: {game.date}</p>
          </div>
        ))}
      </div>
    ) : <p style={{ fontSize: `${fontSizez}px` }} onMouseOver={handleWordHover}>No games in the last 7 days.</p>;
  } else if (selectedOption === '30Days') {
    const gamesLastMonth = pregames.games_last_month || [];
    const gamesCount = gamesLastMonth.length;
    return gamesCount ? (
      <div onMouseOver={handleWordHover} className="past-games-container">
        {gamesLastMonth.map((game) => (
          <div onMouseOver={handleWordHover} key={game.id} className="past-games">
            <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover}>Title: {game.name}</p>
            <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover}>Sport: {game.sport}</p>
            <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover}>Date: {game.date}</p>
          </div>
        ))}
      </div>
    ) : <p style={{ fontSize: `${fontSizez}px` }} onMouseOver={handleWordHover}>No games in the last 30 days.</p>;
  } else if (selectedOption === '90Days') {
    const gamesLast90Days = pregames.games_last_90_days || [];
    const gamesCount = gamesLast90Days.length;
    return gamesCount ? (
      <div onMouseOver={handleWordHover} className="past-games-container">
        {gamesLast90Days.map((game) => (
          <div onMouseOver={handleWordHover} key={game.id} className="past-games">
            <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover} >Title: {game.name}</p>
            <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover} >Sport: {game.sport}</p>
            <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover} >Date: {game.date}</p>
          </div>
        ))}
      </div>
    ) : <p style={{ fontSize: `${fontSizez}px` }} onMouseOver={handleWordHover} >No games in the last 90 days.</p>;
  } else if (selectedOption === '1year') {
    const gamesLastYear = pregames.games_last_year || [];
    const gamesCount = gamesLastYear.length;
    return gamesCount ? (
      <div onMouseOver={handleWordHover}  className="past-games-container">
        {gamesLastYear.map((game) => (
          <div onMouseOver={handleWordHover} key={game.id} className="past-games">
            <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover} >Title: {game.name}</p>
            <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover} >Sport: {game.sport}</p>
            <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover} >Date: {game.date}</p>
          </div>
        ))}
      </div>
    ) : <p style={{ fontSize: `${fontSizez}px` }} onMouseOver={handleWordHover}>No games in the last year.</p>;
  } else {
    const gamesAllTime = pregames.games_all_time || [];
    const gamesCount = gamesAllTime.length;
    return gamesCount ? (
      <div className="past-games-container">
        {gamesAllTime.map((game) => (
          <div onMouseOver={handleWordHover} key={game.id} className="past-games">
            <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover} >Title: {game.name}</p>
            <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover} >Sport: {game.sport}</p>
            <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover}>Date: {game.date}</p>
          </div>
        ))}
      </div>
    ) : <p style={{ fontSize: `${fontSizez}px` }} onMouseOver={handleWordHover} >No Games Played.</p>;
  }
};

const [username, setUsername] = useState('');
useEffect(() => {
  const token = localStorage.getItem('token');
  fetch('https://matchpoint.games/api/username', {
    headers: {
      'Authorization': `Token ${token}`
    }
  })
    .then(response => response.json())
    .then(data => setUsername(data.username));
}, []);


const [date_joined, setDate] = useState('');
useEffect(() => {
  const token = localStorage.getItem('token');
  fetch('https://matchpoint.games/api/join_date', {
    headers: {
      'Authorization': `Token ${token}`
    }
  })
    .then(response => response.json())
    .then(data => setDate(data.join_date));
  }, []);
    

const [friendCount, setFriendCount] = useState(0);
useEffect(() => {
  const token = localStorage.getItem('token');
  fetch('https://matchpoint.games/api/friend_count', {
    headers: {
      'Authorization': `Token ${token}`
    }
  })
    .then(response => response.json())
    .then(data => setFriendCount(data.friend_count));
}, []);


const [games, setGames] = useState([]);
useEffect(() => {
  const token = localStorage.getItem('token');
  fetch('https://matchpoint.games/api/ugames', {
    headers: {
      'Authorization': `Token ${token}`
    }
  })
    .then(response => response.json())
    .then(data => setGames(data.games));
}, []);
const gameone = games.length > 0 ? games[0] : null;
const gametwo = games.length > 1 ? games[1] : null;


const [past_games, setPastGames] = useState([]);
useEffect(() => {
  const token = localStorage.getItem('token');
  fetch('https://matchpoint.games/api/past_games', {
    headers: {
      'Authorization': `Token ${token}`
    }
  })
    .then(response => response.json())
    .then(data => setPastGames(data.games));
}, []);
const sessionone = past_games.length > 0 ? past_games[0] : null;
const sessiontwo = past_games.length > 1 ? past_games[1] : null;
const sessionthree = past_games.length > 2 ? past_games[2] : null;
const sessionfour = past_games.length > 3 ? past_games[3] : null;
  

const [friendName, setFriendName] = useState([]);
useEffect(() => {
  const token = localStorage.getItem('token');
  fetch('https://matchpoint.games/api/friend_view', {
    headers: {
      'Authorization': `Token ${token}`
    }
  })
    .then(response => response.json())
    .then(data => setFriendName(data.friends));
}, []);


const friendone = friendName.length > 0 ? friendName[0] : null;
const friendtwo = friendName.length > 1 ? friendName[1] : null;
const friendthree = friendName.length > 2 ? friendName[2] : null;
const friendfour = friendName.length > 3 ? friendName[3] : null;
  

const navigate = useNavigate();
const friendClickOne = () => {
  navigate(`/`)
  setTimeout(() => {
    navigate(`/friendstats/${friendone.id}/`);
  }, 0);
};

const friendClickTwo = () => {
  navigate(`/`)
  setTimeout(() => {
    navigate(`/friendstats/${friendtwo.id}/`);
  }, 0);
};

const friendClickThree = () => {
  navigate(`/`)
  setTimeout(() => {
    navigate(`/friendstats/${friendthree.id}/`);
  }, 0);
};

const friendClickFour = () => {
  navigate(`/`)
  setTimeout(() => {
    navigate(`/friendstats/${friendfour.id}/`);
  }, 0);
};





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
const [fontSize, setFontSize] = useState(17);
const [fontSizeh, setFontSizeh] = useState(23);
const [fontSizez, setFontSizez] = useState(20);
const [fontSizew, setfontSizew] = useState(14);
const [fontSizei, setfontSizei] = useState(17);
const [fontSizeb, setfontSizeb] = useState(37);
const [fontSizes, setfontSizes] = useState(32);





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
      <div className="stats-main">
        <div className="stats-main-box">
          <div className="row row-1">

            <div className="stats-div1">
              <div className="left-section">
              <i class="bi bi-person-square"></i>
              </div>
              <div  className="right-section">
                <div className="top-section">
                <h3 style={{ fontSize: `${fontSizes}px` }} onMouseOver={handleWordHover} className='user-name'>
                  {username}
                </h3>
                <FaUserCircle onMouseOver={handleWordHover} className="profile-icon" />
                </div>
                <div className="bottom-section">
                  <div className="bottom-left">
                  <img src={logoDark} alt="Match Point" className="Logo-stats" />
                  <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover} className='date-stats'>
                  {date_joined}
                  </p>
                  </div>
                  <div className="bottom-middle1">
                    <FaUserFriends style={{ fontSize: `${fontSizes}px` }} onMouseOver={handleWordHover} className='friends-icon'/>
                    <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover} className='date-stats'>
                      {friendCount}
                    </p>
                  </div>
                  <div className="bottom-middle2">
                    <FaCheck style={{ fontSize: `${fontSizes}px` }} className='friends-icon'/>
                    <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover} className='date-stats-4'>-</p>
                  </div>
                  <div className="bottom-right">
                    <FaTimes style={{ fontSize: `${fontSizes}px` }} className='friends-icon'/>
                    <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover} className='date-stats-4'>-</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="stats-div2">
              <div className='div2-top'>
              <i class="bi bi-calendar-date"></i>
                <h4 style={{ fontSize: `${fontSizez}px` }} onMouseOver={handleWordHover}>Upcoming Games
                </h4>
              </div>

              <div className='div2-bottom'>
              {gameone ? (
                <div onMouseOver={handleWordHover} className='upcome-game'>
                  <div style={{ fontSize: `${fontSizew}px` }} className='upcome-name'>
                    <p style={{ fontSize: `${fontSizew}px` }} className='title-div2'>Name:</p>
                    <p>
                      {gameone.name}
                    </p>
                  </div>           
                  <div className='upcome-sport'>
                    <p style={{ fontSize: `${fontSizew}px` }} className='title-div2'>Sport:</p>
                    <p style={{ fontSize: `${fontSizew}px` }}>
                      {gameone.sport}
                    </p>
                  </div>
                  <div className='upcome-location'>
                    <p style={{ fontSize: `${fontSizew}px` }} className='title-div2'>Location:</p>
                    <p style={{ fontSize: `${fontSizew}px` }}>
                      {gameone.location}
                    </p>
                  </div>
                  <div className='upcome-date'>
                    <p style={{ fontSize: `${fontSizew}px` }} className='title-div2'>Date:</p>
                    <p style={{ fontSize: `${fontSizew}px` }}>
                      {gameone.date}
                    </p>
                  </div>
                  <div className='upcome-time'>
                    <p style={{ fontSize: `${fontSizew}px` }} className='title-div2'>Time:</p>
                    <p style={{ fontSize: `${fontSizew}px` }}>
                      {gameone.time}
                    </p>
                  </div>
                </div>
                ) : (
                  <div style={{ fontSize: `${fontSizew}px` }}  onMouseOver={handleWordHover}>No Upcoming Games</div>
      )}

              {gametwo ? (
                <div className='upcome-game2'>
                  <div onMouseOver={handleWordHover} className='upcome-name'>
                    <p style={{ fontSize: `${fontSizew}px` }} className='title-div2'>Name:</p>
                    <p style={{ fontSize: `${fontSizew}px` }}>
                      {gametwo.name}
                    </p>
                  </div>
                  <div className='upcome-sport'>
                    <p style={{ fontSize: `${fontSizew}px` }} className='title-div2'>Sport:</p>
                    <p style={{ fontSize: `${fontSizew}px` }}>
                      {gametwo.sport}
                  </p>
                  </div>
                  <div className='upcome-location'>
                    <p style={{ fontSize: `${fontSizew}px` }} className='title-div2'>Location:</p>
                    <p style={{ fontSize: `${fontSizew}px` }}>
                      {gametwo.location}
                    </p>
                  </div>
                  <div className='upcome-date'>
                    <p style={{ fontSize: `${fontSizew}px` }} className='title-div2'>Date:</p>
                    <p style={{ fontSize: `${fontSizew}px` }}>
                      {gametwo.date}
                    </p>
                  </div>
                  <div className='upcome-time'>
                    <p style={{ fontSize: `${fontSizew}px` }} className='title-div2'>Time:</p>
                    <p style={{ fontSize: `${fontSizew}px` }} >
                      {gametwo.time}
                    </p>
                  </div>
                </div>
                ) : null}

              </div>

            </div>

            <div className="stats-div3">
              <div className='div3-top'>
              <i style={{ fontSize: `${fontSizeb}px` }}  class="bi bi-bar-chart-line-fill"></i>
              <h2 style={{ fontSize: `${fontSizeb}px` }} onMouseOver={handleWordHover} >Statistics</h2>
              </div>
              <div className='div3-bottom'>
                <div className='STATS'>
              <ul>
          <li style={{ fontSize: `${fontSizei}px` }}onMouseOver={handleWordHover} className={selectedOption === '7Days' ? 'active' : ''} onClick={() => handleOptionClick('7Days')}> Last 7 days</li>
          <li style={{ fontSize: `${fontSizei}px` }} onMouseOver={handleWordHover}className={selectedOption === '30Days' ? 'active' : ''} onClick={() => handleOptionClick('30Days')}>Last 30 days</li>
          <li style={{ fontSize: `${fontSizei}px` }} onMouseOver={handleWordHover} className={selectedOption === '90Days' ? 'active' : ''} onClick={() => handleOptionClick('90Days')}>Last 90 days</li>
          <li style={{ fontSize: `${fontSizei}px` }} onMouseOver={handleWordHover} className={selectedOption === '1year' ? 'active' : ''} onClick={() => handleOptionClick('1year')}> Last year</li>
          <li style={{ fontSize: `${fontSizei}px` }} onMouseOver={handleWordHover} className={selectedOption === 'allTime' ? 'active' : ''} onClick={() => handleOptionClick('allTime')}>All time</li>
        </ul>
        {renderStatsText()}
        </div>
              </div>
            </div>




          </div>
          <div className="row row-2">
          <div className='stat-font'>
      <button
             onMouseOver={handleWordHover}
             className="stat-inc"
             onClick={() => {
               setFontSize(fontSize + 2);
               setFontSizeh(fontSizeh + 2);
               setFontSizez(fontSizez + 2);
               setfontSizew(fontSizew + 2);
               setfontSizei(fontSizei + 2);
               setfontSizeb(fontSizeb + 2);
               setfontSizes(fontSizes + 2);
               
               
             }}
           >
             + Increase
           </button>
           <button
             onMouseOver={handleWordHover}
            className="stat-inc"
             onClick={() => {
               setFontSize(fontSize - 2);
               setFontSizeh(fontSizeh - 2);
               setFontSizez(fontSizez - 2);
               setfontSizew(fontSizew - 2);
               setfontSizei(fontSizei - 2);
               setfontSizeb(fontSizeb - 2);
               setfontSizes(fontSizes - 2);
             }}
           >
             - Decrease
           </button>
           </div>


            <div className="stats-div5">
              <div className='div5-top'>
                <h2 style={{ fontSize: `${fontSizeh}px` }} onMouseOver={handleWordHover} >Friends</h2>

              </div>
              <div className='div5-bottom'>
                <div onMouseOver={handleWordHover} className='friend-stats'>

                {friendone ? (
                  <div className='username-friends' onClick={friendClickOne}>
                  <h3 style={{ fontSize: `${fontSize}px` }} onMouseOver={handleWordHover} className="friend">{friendone.username}</h3>
                  </div>
                  ) : (
                    <div style={{ fontSize: `${fontSize}px` }} onMouseOver={handleWordHover}>
                      You Have No Friends
                    </div>
                  )}

                  {friendone && (

                  <div className='logo-friends-stats'>
                  <i style={{ fontSize: `${fontSize}px` }} class="bi bi-bar-chart-line-fill"></i>
                  </div>
                  )}
                </div>
                <div onMouseOver={handleWordHover} className='friend-stats'>

                  {friendtwo ? (
                  <div onMouseOver={handleWordHover} className='username-friends'onClick={friendClickTwo}>
                  <h3 style={{ fontSize: `${fontSize}px` }} onMouseOver={handleWordHover} className="friend">{friendtwo.username}</h3>
                  </div>
                  ) : null}
                  
                  {friendtwo && (

                  <div onMouseOver={handleWordHover} className='logo-friends-stats'>
                  <i style={{ fontSize: `${fontSize}px` }} class="bi bi-bar-chart-line-fill"></i>
                  </div>
                  )}
                </div>
                <div onMouseOver={handleWordHover} className='friend-stats'>

                  {friendthree ? (
                  <div onMouseOver={handleWordHover} className='username-friends' onClick={friendClickThree}>
                  <h3 style={{ fontSize: `${fontSize}px` }} onMouseOver={handleWordHover} className="friend">{friendthree.username}</h3>
                  </div>
                  ) : null}
                  
                  {friendthree && (


                  <div onMouseOver={handleWordHover} className='logo-friends-stats'>
                  <i style={{ fontSize: `${fontSize}px` }} class="bi bi-bar-chart-line-fill"></i>
                  </div>
                  )}
                </div>
                <div onMouseOver={handleWordHover} className='friend-stats-last'>

                  {friendfour ? (
                  <div onMouseOver={handleWordHover} className='username-friends' onClick={friendClickFour}>
                  <h3 style={{ fontSize: `${fontSize}px` }} className="friend">{friendfour.username}</h3>
                  </div>
                  ) : null}


                  {friendfour && (

                  <div className='logo-friends-stats'>
                  <i style={{ fontSize: `${fontSize}px` }} class="bi bi-bar-chart-line-fill"></i>
                  </div>
                  )}
                </div>



              </div>
            </div>

            <div className="stats-div6">
              <div className='stats-6-main'> 
              <div className='title-6'>
                <div className='titles-div6'><h3 style={{ fontSize: `${fontSizez}px` }}onMouseOver={handleWordHover}>Session:</h3></div>
                <div className='titles-div7'><h3 style={{ fontSize: `${fontSizez}px` }} onMouseOver={handleWordHover}>Result:</h3></div>
                <div className='titles-div8'><h3 style={{ fontSize: `${fontSizez}px` }} onMouseOver={handleWordHover}>Date:</h3></div>

              </div>


              <div className='details-6'>
                
                <div onMouseOver={handleWordHover} className='players-6'>
                  <div className='player-history'>
                    {sessionone ? (
                    <div onMouseOver={handleWordHover} className='player-names'>
                    <p onMouseOver={handleWordHover}>{sessionone.name}</p>
                    </div>
                    ) : (
                      <div style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover}>No Past Games</div>
                      )}
                  </div>
                  
                  <div onMouseOver={handleWordHover} className='player-history'>
                    {sessiontwo ? (
                    <div className='player-names'>
                    <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover}>{sessiontwo.name}</p>
                    </div>
                    ) : null}
                  </div>

                  <div onMouseOver={handleWordHover} className='player-history'>
                    {sessionthree ? (
                    <div className='player-names'>
                    <p style={{ fontSize: `${fontSizew}px` }}onMouseOver={handleWordHover}  >{sessionthree.name}</p>
                    </div>
                    ) : null}
                  </div>


                  <div onMouseOver={handleWordHover} className='player-history'>
                    {sessionfour ? (
                    <div onMouseOver={handleWordHover} className='player-names'>
                    <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover} >{sessionfour.name}</p>
                    </div>
                    ) : null}
                  </div>
                </div>



                <div className='results-6'>

                  <div onMouseOver={handleWordHover} className='result-main'>
                    <div onMouseOver={handleWordHover} className='result-number'>
                      <p>-</p>
                      <p>-</p>
                    </div>
                    <div className='result-icon'>
                    </div>
                  </div>

                  <div className='result-main'>
                    <div className='result-number'>
                      <p>-</p>
                      <p>-</p>
                    </div>
                    <div className='result-icon'>
                    </div>
                  </div>

                  <div className='result-main'>
                    <div className='result-number'>
                      <p>-</p>
                      <p>-</p>
                    </div>
                    <div className='result-icon'>
                    </div>
                  </div>

                  <div className='result-main'>
                    <div className='result-number'>
                      <p>-</p>
                      <p>-</p>
                    </div>
                    <div className='result-icon'>
                    </div>
                  </div>
                </div>





                <div className='date-6'>


                  {sessionone ? (
                  <div onMouseOver={handleWordHover} className='date-main-6'>
                    <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover}>{sessionone.date}</p>
                  </div>
                  ) : (
                      <div></div>
                      )}

                  {sessiontwo ? (    
                  <div onMouseOver={handleWordHover} className='date-main-6'>
                    <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover} >{sessiontwo.date}</p>
                  </div>
                  ) : null}

                  {sessionthree ? (
                  <div onMouseOver={handleWordHover} className='date-main-6'>
                    <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover} >{sessionthree.date}</p>
                  </div>
                  ) : null}

                  {sessionfour ? (
                  <div onMouseOver={handleWordHover} className='date-main-6'>
                    <p style={{ fontSize: `${fontSizew}px` }} onMouseOver={handleWordHover} >{sessionfour.date}</p>
                  </div>
                  ) : null}

                </div>


              </div>

              </div>



            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;