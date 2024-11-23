import Button from "react-bootstrap/Button";
import { Router } from "react-router-dom";
import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Social.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, ListGroup } from "react-bootstrap";
import {
  faCheck,
  faTimes,
  faUserPlus,
  faUser,
  faUserGroup,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import logoDark from "../assets/greylogo.png";

const Social = () => {
  // const { id } = useParams();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendRequestsFromUser, setFriendRequestsFromUser] = useState([]);
  const [toUserPk, setToUserPk] = useState("");
  const [toUsername, setToUsername] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [recentplayedwith, setrecentplayedwith] = useState([]);



  useEffect(() => {
    const getFriends = async () => {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      console.log("token", token);
      const response = await fetch(`https://matchpoint.games/api/friends/`, {
        headers: {
          Authorization: `Token ${token}` // Add the token to the Authorization header
        }
      });
      const data = await response.json();
      console.log("DATA", data);
      setFriends(data);
    };
    getFriends();
  }, []);



  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`https://matchpoint.games/api/getfriendsrequest/`, {
      headers: {
        Authorization: `Token ${token}` // Add the token to the Authorization header
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setFriendRequests(data);
      });
  }, []);



  useEffect(() => {
    const handleSearch = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://matchpoint.games/api/searchfriends/${searchTerm}/`,
        {
          headers: {
            Authorization: `Token ${token}` // Add the token to the Authorization header
          }
        });
      const data = await response.json();
      console.log("DATA", data);
      const filteredFriends = data.filter((result) => {
        return result.friends_user_2.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredFriends(filteredFriends);
    };
    handleSearch();
  }, [searchTerm]);



  const handleInputChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
  };



  const handleDelete = (friendId) => {
    const token = localStorage.getItem("token");
    fetch(`https://matchpoint.games/api/removefriend/${friendId}/`,
      {
        headers: {
          Authorization: `Token ${token}` // Add the token to the Authorization header
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const updatedFriends = friends.filter(friend => friend.user_2 !== friendId);
        setFriends(updatedFriends);
        setFilteredFriends(updatedFriends);
      })
      .catch(error => {
        console.error('Error removing friend:', error);
      });
  }



  const handleAddFriendSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const checkfriend = await fetch(`https://matchpoint.games/api/friends/`, {
      headers: {
        Authorization: `Token ${token}` // Add the token to the Authorization header
      }
    });
    const checkfrienddata = await checkfriend.json();
    console.log("checkfrienddata", checkfrienddata);
    const checkRequestResponse = await fetch(`https://matchpoint.games/api/getfriendsrequestfromuser/`, {
      headers: {
        Authorization: `Token ${token}` // Add the token to the Authorization header
      }
    });
    const checkRequestData = await checkRequestResponse.json();
    console.log("checkRequestData", checkRequestData);
    const username = await fetch(`https://matchpoint.games/api/getusername/`, {
      headers: {
        Authorization: `Token ${token}` // Add the token to the Authorization header
      }
    });
    const userdata = await username.json();
    console.log("toUsername", toUsername);
    if (toUsername === userdata.user_name) {
      setError("You cannot send a friend request to yourself");
    } else if (checkfrienddata.some(friend => friend.friends_user_2 === toUsername)) {
      setError("This user is already your friend");
    } else if (checkRequestData.some(request => request.to_user_name === toUsername)) {
      setError("You have already sent a friend request to this user");
    } else {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://matchpoint.games/api/send_request/${toUsername}/`, {
        headers: {
          Authorization: `Token ${token}` // Add the token to the Authorization header
        }
      });
      if (!response.ok) {
        setError("The Username That You Have Entered Does Not Exist.");
      } else {
        const data = await response.json();
        console.log("DATA", data);
        setSuccess(true);
        setError(null);
      }
    }
  };



  const acceptRequest = (requestId) => {
    const token = localStorage.getItem("token");
    fetch(`https://matchpoint.games/api/accept_request/${requestId}/`, {
      headers: {
        Authorization: `Token ${token}` // Add the token to the Authorization header
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setFriendRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== requestId)
        );
      })
      .catch((error) => console.error(error));
  };



  const rejectRequest = (requestId) => {
    const token = localStorage.getItem("token");
    fetch(`https://matchpoint.games/api/reject_request/${requestId}/`, {
      headers: {
        Authorization: `Token ${token}` // Add the token to the Authorization header
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setFriendRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== requestId)
        );
      })
      .catch((error) => console.error(error));
  };



  useEffect(() => {
    const getfriendsrequestfromuser = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://matchpoint.games/api/getfriendsrequestfromuser/`, {
        headers: {
          Authorization: `Token ${token}` // Add the token to the Authorization header
        }
      })
      const data = await response.json();
      console.log("DATA", data);
      setFriendRequestsFromUser(data);
    };
    getfriendsrequestfromuser();
  }, []);



  useEffect(() => {
    const getrecentplayed = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://matchpoint.games/api/getrecentplayedwith/`, {
        headers: {
          Authorization: `Token ${token}` // Add the token to the Authorization header
        }
      })
      const data = await response.json();
      console.log("DATA1", data);
      // const players = Array.isArray(data) ? data : Object.values(data);
      const filteredFriends = data.filter(player => !friends.some(friend => friend.user_2 === player.user.id));
      console.log("filteredFriends", filteredFriends);
      const filteredRequests = filteredFriends.filter(player => !friendRequestsFromUser.some(request => request.to_user === player.user.id));
      console.log("friendRequests", friendRequestsFromUser);
      console.log("filteredRequests", filteredRequests);
      setrecentplayedwith(filteredRequests);
    };
    getrecentplayed();
  }, [friends, friendRequestsFromUser]);



  const addrecentplayedwith = async (toUsername) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://matchpoint.games/api/send_request/${toUsername}/`,
      {
        headers: {
          Authorization: `Token ${token}` // Add the token to the Authorization header
        }
      })
    const data = await response.json();
    console.log("DATA", data);
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
      <div className="social-main">
        <div className="social-container">
          <div className="social-left-side">
            <div className="four-buttons">
              <div className="top-buttons">
                <div className="button-2">
                  <form className="add-form" onSubmit={handleAddFriendSubmit}>
                  <div className="search-speech1">
                <h5  style={{ fontSize: `${fontSizei}px` }} onMouseOver={handleWordHover} className="search-speech-h">Search To Add New Friends:</h5>

              </div>
                    
                    <div className="add-friend-box" >
                      <div className="search-logo">
                        <svg 
                          id="Search-Icon1"
                          className="Search-Icons"
                          fill="#000000"
                          width="20px"
                          height="20px"
                          viewBox="0 0 32 32"
                          xmlns="http://www.w3.org/2000/svg"
                          stroke="#ffffff"
                        >
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            <path d="M27 24.57l-5.647-5.648a8.895 8.895 0 0 0 1.522-4.984C22.875 9.01 18.867 5 13.938 5 9.01 5 5 9.01 5 13.938c0 4.929 4.01 8.938 8.938 8.938a8.887 8.887 0 0 0 4.984-1.522L24.568 27 27 24.57zm-13.062-4.445a6.194 6.194 0 0 1-6.188-6.188 6.195 6.195 0 0 1 6.188-6.188 6.195 6.195 0 0 1 6.188 6.188 6.195 6.195 0 0 1-6.188 6.188z"></path>
                          </g>
                        </svg>
                      </div>
                      <input 
                        placeholder="Enter Username to add friend"
                        type="text"
                        value={toUsername}
                        onChange={(event) => setToUsername(event.target.value)}
                      />
                    </div>
                    <div style={{ fontSize: `${fontSizew}px` }} className="error-social">
                    {error && <p>{error}</p>}
                      {success && <p>Friend request has been sent. </p>}
                      </div>
                    <div className="add-friend-div">
                      
                      <button style={{ fontSize: `${fontSizew}px` }}  onMouseOver={handleWordHover} className="add-friend-button" type="submit">
                        <FontAwesomeIcon onMouseOver={handleWordHover} className="user-plus" icon={faUserPlus} /> Add Friend
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            </div>
            <div className="friend-search">
              <div className="search-speech2">
                <h5 style={{ fontSize: `${fontSizei}px` }} onMouseOver={handleWordHover} className="search-speech-h">View And Search Friends List:</h5>

              </div>
              <div className="search-bar">
                <div className=" search-logo">
                  <svg
                    id="Search-Icon1"
                    className="Search-Icons"
                    fill="#000000"
                    width="20px"
                    height="20px"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#ffffff"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path d="M27 24.57l-5.647-5.648a8.895 8.895 0 0 0 1.522-4.984C22.875 9.01 18.867 5 13.938 5 9.01 5 5 9.01 5 13.938c0 4.929 4.01 8.938 8.938 8.938a8.887 8.887 0 0 0 4.984-1.522L24.568 27 27 24.57zm-13.062-4.445a6.194 6.194 0 0 1-6.188-6.188 6.195 6.195 0 0 1 6.188-6.188 6.195 6.195 0 0 1 6.188 6.188 6.195 6.195 0 0 1-6.188 6.188z"></path>
                    </g>
                  </svg>
                </div>
                <div className="search-input">
  
                  <input
                    placeholder="Search by username"
                    type="text"
                    value={searchTerm}
                    onInput={handleInputChange}
                  />
                </div>
              </div>
              <div className="friends-number">
                <h5 style={{ fontSize: `${fontSizei}px` }}  onMouseOver={handleWordHover}>Friends: {friends.length}</h5>
              </div>
              <div className="list-of-friends">
                <ul onMouseOver={handleWordHover}>
                  {searchTerm === ""
                    ? friends.map((friend) => <li style={{ fontSize: `${fontSizew}px` }} key={friend.id}  >{friend.friends_user_2}
                      <button  style={{ fontSize: `${fontSizew}px` }} className="remove-btn"  onClick={() => handleDelete(friend.user_2)}>Remove</button>
                    </li>)
                    : filteredFriends.map((friend) => <li style={{ fontSize: `${fontSizew}px` }} key={friend.id} >{friend.friends_user_2}
                      <button style={{ fontSize: `${fontSizew}px` }} className="remove-btn" onClick={() => handleDelete(friend.user_2)}>Remove</button>
                    </li>)}
                </ul>
              </div>
            </div>
          </div>

          <div className="social-right-side">
          <div className='stat-font'>
      <button
             onMouseOver={handleWordHover}
             className="stat-inc1"
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
            className="stat-inc1"
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
            <div className="recently-played-with">
              <div className="rpw-title">
                <h2 style={{ fontSize: `${fontSizez}px`, overflow: 'auto' }} onMouseOver={handleWordHover} >Recently Played with</h2>
              </div>
              <div className="rpw-content">
                <ListGroup onMouseOver={handleWordHover} className="ListGroup-1">
                  {recentplayedwith.map((player) => (
                    <ListGroup.Item className="list-group-item" key={player.id}>
                      <div className="recent-social">
                        <div style={{ fontSize: `${fontSizew}px` }}className="recent-user">
                          {player.user_name}
                          <Button
                            variant="black"
                            style={{
                              width: "9%",
                              height: "25px",
                              padding: "0px",
                              float: "right",
                              fontSize: `${fontSizew}px`
                            }}
                            onClick={() => addrecentplayedwith(player.user_name)}
                          >
                            <FontAwesomeIcon style={{ fontSize: `${fontSizew}px` }} icon={faUserPlus} color="black" />
                          </Button>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </div>

            <div className="friend-request">
              <div className="fr-title">
                <h2 style={{ fontSize: `${fontSizez}px` }} onMouseOver={handleWordHover}>Friend Requests</h2>
              </div>
              <div className="rpw-content">
                <ListGroup className="ListGroup-1">
                  {friendRequests.map((request) => (
                    <ListGroup.Item style={{ fontSize: `${fontSizei}px` }} onMouseOver={handleWordHover} className="list-group-item" key={request.id}>
                      {request.from_user_name}
                      <Button  className="delete"
                        variant="danger"
                        style={{
                          width: "9%",
                          height: "25px",
                          padding: "0px",
                          float: "right",
                        }}
                        onClick={() => rejectRequest(request.id)}
                      >
                        <FontAwesomeIcon onMouseOver={handleWordHover} icon={faTimes} />
                      </Button>
                      <Button className="accept"
                        variant="success"
                        style={{
                          width: "9%",
                          height: "25px",
                          padding: "0px",
                          float: "right",
                          marginRight: "10px",
                        }}
                        onClick={() => acceptRequest(request.id)}
                      >
                        {" "}
                        <FontAwesomeIcon icon={faCheck} />
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Social;
