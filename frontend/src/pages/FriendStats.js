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
  useParams,
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


const [pregames, setPreGames] = useState([]);
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(`https://matchpoint.games/api/fpregames/${user_id}/`); // Replace the URL with your actual API endpoint
        setPreGames(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchGames();
  }, []);

  const renderStatsText = () => {
    if (selectedOption === '7Days') {
      const gamesLastWeek = pregames.games_last_week || [];
      const gamesCount = gamesLastWeek.length;
      return gamesCount ? (
        <div  onMouseOver={handleWordHover} className="past-games-container">
          {gamesLastWeek.map((game) => (
            <div  onMouseOver={handleWordHover}  key={game.id} className="past-games">
              <p  onMouseOver={handleWordHover} >Title: {game.name}</p>
              <p  onMouseOver={handleWordHover} >Sport: {game.sport}</p>
              <p  onMouseOver={handleWordHover}>Date: {game.date}</p>
            </div>
          ))}
        </div>
      ) : <p  onMouseOver={handleWordHover} >No games in the last 7 days.</p>;
    } else if (selectedOption === '30Days') {
      const gamesLastMonth = pregames.games_last_month || [];
      const gamesCount = gamesLastMonth.length;
      return gamesCount ? (
        <div  onMouseOver={handleWordHover} className="past-games-container">
          {gamesLastMonth.map((game) => (
            <div  onMouseOver={handleWordHover}  key={game.id} className="past-games">
              <p  onMouseOver={handleWordHover} >Title: {game.name}</p>
              <p  onMouseOver={handleWordHover} >Sport: {game.sport}</p>
              <p onMouseOver={handleWordHover} >Date: {game.date}</p>
            </div>
          ))}
        </div>
      ) : <p onMouseOver={handleWordHover} >No games in the last 30 days.</p>;
    } else if (selectedOption === '90Days') {
      const gamesLast90Days = pregames.games_last_90_days || [];
      const gamesCount = gamesLast90Days.length;
      return gamesCount ? (
        <div onMouseOver={handleWordHover} className="past-games-container">
          {gamesLast90Days.map((game) => (
            <div onMouseOver={handleWordHover} key={game.id} className="past-games">
              <p onMouseOver={handleWordHover} >Title: {game.name}</p>
              <p onMouseOver={handleWordHover} >Sport: {game.sport}</p>
              <p onMouseOver={handleWordHover} >Date: {game.date}</p>
            </div>
          ))}
        </div>
      ) : <p onMouseOver={handleWordHover} >No games in the last 90 days.</p>;
    } else if (selectedOption === '1year') {
      const gamesLastYear = pregames.games_last_year || [];
      const gamesCount = gamesLastYear.length;
      return gamesCount ? (
        <div onMouseOver={handleWordHover} className="past-games-container">
          {gamesLastYear.map((game) => (
            <div onMouseOver={handleWordHover} key={game.id} className="past-games">
              <p onMouseOver={handleWordHover} >Title: {game.name}</p>
              <p onMouseOver={handleWordHover} >Sport: {game.sport}</p>
              <p onMouseOver={handleWordHover} >Date: {game.date}</p>
            </div>
          ))}
        </div>
      ) : <p onMouseOver={handleWordHover} >No games in the last year.</p>;
    } else {
      const gamesAllTime = pregames.games_all_time || [];
      const gamesCount = gamesAllTime.length;
      return gamesCount ? (
        <div onMouseOver={handleWordHover} className="past-games-container">
          {gamesAllTime.map((game) => (
            <div onMouseOver={handleWordHover} key={game.id} className="past-games">
              <p onMouseOver={handleWordHover} >Title: {game.name}</p>
              <p onMouseOver={handleWordHover}>Sport: {game.sport}</p>
              <p onMouseOver={handleWordHover} >Date: {game.date}</p>
            </div>
          ))}
        </div>
      ) : <p onMouseOver={handleWordHover}>No Games Played.</p>;
    }
  };
  


const { user_id } = useParams();

const [username, setUsername] = useState('');
useEffect(() => {
    const fetchUsername = async () => {    
    const response = await fetch(`https://matchpoint.games/api/fusername/${user_id}/`);
    const data = await response.json();
    setUsername(data.username);
  };
  fetchUsername()
  }, []);

const [date_joined, setDate] = useState('');
useEffect(() => {
    const fetchDate = async () => {    
    const response = await fetch(`https://matchpoint.games/api/fjoin_date/${user_id}/`);
    const data = await response.json();
    setDate(data.join_date);
  };
  fetchDate()
  }, []);

const [friend_count, setFriendCount] = useState(0);
useEffect(() => {
    const fetchCount = async () => {    
    const response = await fetch(`https://matchpoint.games/api/ffriend_count/${user_id}/`);
    const data = await response.json();
    setFriendCount(data.friend_count);
  };
  fetchCount()
  }, []);


const [games, setGames] = useState([user_id]);
useEffect(() => {
  const fetchUgames = async () => {    
  const response = await fetch(`https://matchpoint.games/api/fupcoming_games/${user_id}/`);
  const data = await response.json();
  setGames(data.games);
};
fetchUgames()
}, [user_id]);
const gameone = games.length > 0 ? games[0] : null;
const gametwo = games.length > 1 ? games[1] : null;

const [weekCount, setWeekCount] = useState(0);
const [monthCount, setMonthCount] = useState(0);
const [threeMonthCount, setThreeMonthCount] = useState(0);
const [yearCount, setYearCount] = useState(0);
const [allTimeCount, setAllTimeCount] = useState(0);

useEffect(() => {
  const fetchData = async () => {  
  const response = await fetch(`https://matchpoint.games/api/fgames_played/${user_id}/`)
  const data = await response.json();
  setWeekCount(data.last_week);
  setMonthCount(data.last_month);
  setThreeMonthCount(data.last_three_month);
  setYearCount(data.last_year);
  setAllTimeCount(data.total);
};
  fetchData()
}, [user_id]);


const [past_games, setPastGames] = useState([user_id]);
useEffect(() => {
  const fetchPgames = async () => {    
  const response = await fetch(`https://matchpoint.games/api/fpast_games/${user_id}/`);
  const data = await response.json();
  setPastGames(data.games);
};
fetchPgames()
}, [user_id]);
const sessionone = past_games.length > 0 ? past_games[0] : null;
const sessiontwo = past_games.length > 1 ? past_games[1] : null;
const sessionthree = past_games.length > 2 ? past_games[2] : null;
const sessionfour = past_games.length > 3 ? past_games[3] : null;
  

const [friendName, setFriendName] = useState([user_id]);
useEffect(() => {
  const fetchData = async () => {    
  const response = await fetch(`https://matchpoint.games/api/ffriend_view/${user_id}/`);
  const data = await response.json();
  setFriendName(data.friends);
};
fetchData()
}, [user_id]);
const friendone = friendName.length > 0 ? friendName[0] : null;
const friendtwo = friendName.length > 1 ? friendName[1] : null;
const friendthree = friendName.length > 2 ? friendName[2] : null;
const friendfour = friendName.length > 3 ? friendName[3] : null;
  
const navigate = useNavigate();
const friendClickOne = () => {
  navigate(`/`)
  setTimeout(() => {
    navigate(`/stats`);
  }, 0);
};

const friendClickTwo = () => {
  navigate(`/`)
  setTimeout(() => {
    navigate(`/stats`);
  }, 0);
};

const friendClickThree = () => {
  navigate(`/`)
  setTimeout(() => {
    navigate(`/stats`);
  }, 0);
};

const friendClickFour = () => {
  navigate(`/`)
  setTimeout(() => {
    navigate(`/stats`);
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
      color="primary"
      name="enableSpeechSynthesis"
      inputProps={{ 'aria-label': 'Enable speech synthesis' }}
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
      <div className="stats-main">
        <div className="stats-main-box">
          <div className="row row-1">

            <div className="stats-div1">
              <div className="left-section">
              <img className="profileTest" src={profileTest} alt="Profile picture" />
              </div>
              <div className="right-section">
                <div className="top-section">
                <h3  onMouseOver={handleWordHover} className='user-name'>
                  {username}
                </h3>
                <FaUserCircle className="profile-icon" />
                </div>
                <div className="bottom-section">
                  <div className="bottom-left">
                  <img src={logoDark} alt="Match Point" className="Logo-stats" />
                  <p  onMouseOver={handleWordHover} className='date-stats'>
                  {date_joined}
                  </p>
                  </div>
                  <div className="bottom-middle1">
                    <FaUserFriends className='friends-icon'/>
                    <p  onMouseOver={handleWordHover} className='date-stats'>
                      {friend_count}
                    </p>
                  </div>
                  <div className="bottom-middle2">
                    <FaCheck className='friends-icon'/>
                    <p  onMouseOver={handleWordHover} className='date-stats-4'>-</p>
                  </div>
                  <div className="bottom-right">
                    <FaTimes className='friends-icon'/>
                    <p  onMouseOver={handleWordHover} className='date-stats-4'>-</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="stats-div2">
              <div className='div2-top'>
              <i class="bi bi-calendar-date"></i>
                <h4  onMouseOver={handleWordHover} >Upcoming Games
                </h4>
              </div>

              <div  onMouseOver={handleWordHover} className='div2-bottom'>
              {gameone ? (
                <div className='upcome-game'>
                  <div className='upcome-name'>
                    <p  onMouseOver={handleWordHover} className='title-div2'>Name:</p>
                    <p  onMouseOver={handleWordHover} >
                      {gameone.name}
                    </p>
                  </div>           
                  <div className='upcome-sport'>
                    <p  onMouseOver={handleWordHover} className='title-div2'>Sport:</p>
                    <p  onMouseOver={handleWordHover} >
                      {gameone.sport}
                    </p>
                  </div>
                  <div className='upcome-location'>
                    <p  onMouseOver={handleWordHover} className='title-div2'>Location:</p>
                    <p  onMouseOver={handleWordHover} >
                      {gameone.location}
                    </p>
                  </div>
                  <div className='upcome-date'>
                    <p  onMouseOver={handleWordHover} className='title-div2'>Date:</p>
                    <p  onMouseOver={handleWordHover} >
                      {gameone.date}
                    </p>
                  </div>
                  <div className='upcome-time'>
                    <p  onMouseOver={handleWordHover} className='title-div2'>Time:</p>
                    <p  onMouseOver={handleWordHover} >
                      {gameone.time}
                    </p>
                  </div>
                </div>
                ) : (
                  <div  onMouseOver={handleWordHover} >No Upcoming Games</div>
                  )}

              {gametwo ? (
                <div  onMouseOver={handleWordHover} className='upcome-game2'>
                  <div className='upcome-name'>
                    <p  onMouseOver={handleWordHover} className='title-div2'>Name:</p>
                    <p  onMouseOver={handleWordHover} >
                      {gametwo.name}
                    </p>
                  </div>
                  <div className='upcome-sport'>
                    <p  onMouseOver={handleWordHover} className='title-div2'>Sport:</p>
                    <p  onMouseOver={handleWordHover} >
                      {gametwo.sport}
                  </p>
                  </div>
                  <div className='upcome-location'>
                    <p  onMouseOver={handleWordHover}  className='title-div2'>Location:</p>
                    <p  onMouseOver={handleWordHover} >
                      {gametwo.location}
                    </p>
                  </div>
                  <div className='upcome-date'>
                    <p  onMouseOver={handleWordHover} className='title-div2'>Date:</p>
                    <p  onMouseOver={handleWordHover} >
                      {gametwo.date}
                    </p>
                  </div>
                  <div className='upcome-time'>
                    <p  onMouseOver={handleWordHover} className='title-div2'>Time:</p>
                    <p  onMouseOver={handleWordHover} >
                      {gametwo.time}
                    </p>
                  </div>
                </div>
                ) : null}

              </div>

            </div>

            <div className="stats-div3">
              <div className='div3-top'>
              <i class="bi bi-bar-chart-line-fill"></i>
              <h2  onMouseOver={handleWordHover} >Statistics</h2>
              </div>
              <div className='div3-bottom'>
                <div className='STATS'>
              <ul>
          <li  onMouseOver={handleWordHover} className={selectedOption === '7Days' ? 'active' : ''} onClick={() => handleOptionClick('7Days')}> Last 7 days</li>
          <li  onMouseOver={handleWordHover} className={selectedOption === '30Days' ? 'active' : ''} onClick={() => handleOptionClick('30Days')}>Last 30 days</li>
          <li  onMouseOver={handleWordHover} className={selectedOption === '90Days' ? 'active' : ''} onClick={() => handleOptionClick('90Days')}>Last 90 days</li>
          <li  onMouseOver={handleWordHover} className={selectedOption === '1year' ? 'active' : ''} onClick={() => handleOptionClick('1year')}> Last year</li>
          <li  onMouseOver={handleWordHover} className={selectedOption === 'allTime' ? 'active' : ''} onClick={() => handleOptionClick('allTime')}>All time</li>
        </ul>
        {renderStatsText()}
        </div>
              </div>
            </div>




          </div>
          <div className="row row-2">
            
            <div className="stats-div5">
              <div className='div5-top'>
                <h2 onMouseOver={handleWordHover} >Friends</h2>

              </div>
              <div className='div5-bottom'>
                <div className='friend-stats'>

                {friendone ? (
                  <div className='username-friends' onClick={friendClickOne}>
                  <h3 onMouseOver={handleWordHover}  className="friend">{friendone.username}</h3>
                  </div>
                  ) : (
                    <div onMouseOver={handleWordHover} >
                      You Have No Friends
                    </div>
                  )}

                  {friendone && (

                  <div className='logo-friends-stats'>
                  <i class="bi bi-bar-chart-line-fill"></i>
                  </div>
                  )}
                </div>
                <div className='friend-stats'>

                  {friendtwo ? (
                  <div className='username-friends'onClick={friendClickTwo}>
                  <h3 onMouseOver={handleWordHover} className="friend">{friendtwo.username}</h3>
                  </div>
                  ) : null}
                  
                  {friendtwo && (

                  <div className='logo-friends-stats'>
                  <i class="bi bi-bar-chart-line-fill"></i>
                  </div>
                  )}
                </div>
                <div className='friend-stats'>

                  {friendthree ? (
                  <div className='username-friends' onClick={friendClickThree}>
                  <h3 onMouseOver={handleWordHover} className="friend">{friendthree.username}</h3>
                  </div>
                  ) : null}
                  
                  {friendthree && (


                  <div className='logo-friends-stats'>
                  <i class="bi bi-bar-chart-line-fill"></i>
                  </div>
                  )}
                </div>
                <div className='friend-stats-last'>

                  {friendfour ? (
                  <div className='username-friends' onClick={friendClickFour}>
                  <h3 onMouseOver={handleWordHover} className="friend">{friendfour.username}</h3>
                  </div>
                  ) : null}


                  {friendfour && (

                  <div className='logo-friends-stats'>
                  <i class="bi bi-bar-chart-line-fill"></i>
                  </div>
                  )}
                </div>



              </div>
            </div>

            <div className="stats-div6">
              <div className='stats-6-main'> 
              <div className='title-6'>
                <div className='titles-div6'><h3 onMouseOver={handleWordHover} >Session:</h3></div>
                <div className='titles-div7'><h3 onMouseOver={handleWordHover} >Result:</h3></div>
                <div className='titles-div8'><h3 onMouseOver={handleWordHover} >Date:</h3></div>

              </div>


              <div className='details-6'>
                
                <div className='players-6'>
                  <div  className='player-history'>
                    {sessionone ? (
                    <div className='player-names'>
                    <p onMouseOver={handleWordHover} >{sessionone.name}</p>
                    </div>
                    ) : (
                      <div onMouseOver={handleWordHover}>No Past Games</div>
                      )}
                  </div>
                  
                  <div className='player-history'>
                    {sessiontwo ? (
                    <div className='player-names'>
                    <p onMouseOver={handleWordHover} >{sessiontwo.name}</p>
                    </div>
                    ) : null}
                  </div>

                  <div className='player-history'>
                    {sessionthree ? (
                    <div className='player-names'>
                    <p onMouseOver={handleWordHover} >{sessionthree.name}</p>
                    </div>
                    ) : null}
                  </div>


                  <div className='player-history'>
                    {sessionfour ? (
                    <div className='player-names'>
                    <p onMouseOver={handleWordHover}>{sessionfour.name}</p>
                    </div>
                    ) : null}
                  </div>
                </div>



                <div className='results-6'>

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
                  <div className='date-main-6'>
                    <p onMouseOver={handleWordHover} >{sessionone.date}</p>
                  </div>
                  ) : (
                      <div></div>
                      )}

                  {sessiontwo ? (    
                  <div className='date-main-6'>
                    <p onMouseOver={handleWordHover} >{sessiontwo.date}</p>
                  </div>
                  ) : null}

                  {sessionthree ? (
                  <div className='date-main-6'>
                    <p onMouseOver={handleWordHover} >{sessionthree.date}</p>
                  </div>
                  ) : null}

                  {sessionfour ? (
                  <div className='date-main-6'>
                    <p onMouseOver={handleWordHover} >{sessionfour.date}</p>
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
