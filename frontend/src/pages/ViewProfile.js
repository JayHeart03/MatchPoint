import React, { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/ViewProfile.css";
import logoDark from "../assets/image.png";
import logoLight from "../assets/logo.png";
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

const ViewProfile = () => {
  const [userInfo, setUserInfo] = useState({
  });

 function validateAge(dateString) {
   const birthday = +new Date(dateString);
   const age = ((Date.now() - birthday) / (31557600000)); // calculating the age
   return age >= 15 && age <= 99;
 }



 useEffect(() => {
   const token = localStorage.getItem('token');
   
   // GET
   fetch(`https://matchpoint.games/api/profiles/`,{
       headers: {
         'Authorization': `Token ${token}`
       }})
     .then(response => response.json())
     .then(data => {
       
       const newFirstName = data.first_name;
       const newLastName = data.last_name;
       const newUsername = data.username;
       const newSportofChoice = data.sport;
       const newMotivation = data.motivation;
       const newPlayingenvironment = data.playing_environment;
     
       const newDateofbirth = data.date_of_birth;
       const newGender = data.gender;

       const newLocation = data.location;
       const newSkillLevel = data.skill_level;
       const newEmail = data.email;
       const newPhone = data.phone_number;

       const dateCreateValue = data.created_at;
       // update userInfo
       setUserInfo(prevState => ({ ...prevState, first_name: newFirstName,last_name:newLastName,username:newUsername,sport:newSportofChoice,
       motivation:newMotivation,playing_environment : newPlayingenvironment,
       date_of_birth:newDateofbirth,gender:newGender,location:newLocation,skill_level:newSkillLevel,email:newEmail,phone_number:newPhone,created_at: dateCreateValue,password:data.password }));
     })
     .catch(error => {
       console.log(error);
     });
 }, []);

 const [isEditing, setIsEditing] = useState(false);

 const handleInputChange = (event) => {
   const { name, value } = event.target;
   setUserInfo({ ...userInfo, [name]: value });

   if (name === "date_of_birth" && !validateAge(value)) {
     // bwtween 15-99
     alert("Invalid age");
     return; 
   }
 };

 const handleFormSubmit = async (event) => {
   event.preventDefault();
   if (!validateAge(userInfo.date_of_birth)) {
     alert("Your age should be between 15 to 99 years old");
     return;
   }
   setIsEditing(false);



   try {
     const token = localStorage.getItem('token');
    
     const response = await fetch(`https://matchpoint.games/api/profiles/`, {
       method: 'PUT',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Token ${token}`
       },
       body: JSON.stringify(userInfo)
     });
 
     const responseData = await response.json();
     console.log(responseData);
   } catch (error) {
     console.error(error);
   }
 };
 const [fontSize, setFontSize] = useState(16);
 const [fontSizeh, setFontSizeh3] = useState(35);



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
   <div>
     <div className="header">
       <div className="logo-holder">
         <Link className="logo-bar">
           <img src={logoDark} alt="Match Point" className="Logo" />
         </Link>
       </div>
       <ul className={click ? "nav-menu active" : "nav-menu"}>
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
           <DarkMode />
         </li>
         <li>
           <ControlButton />
         </li>
         <li>
           <Link to="/creategame" onMouseOver={handleWordHover}>
             Create Game
           </Link>
         </li>
         <li>
           <Link to="/joingame" onMouseOver={handleWordHover}>
             Join Game
           </Link>
         </li>
         <li>
           <Link to="/viewprofile" onMouseOver={handleWordHover}>
             View Profile
           </Link>
         </li>
         <li>
           <Link to="/stats" onMouseOver={handleWordHover}>
             Stats
           </Link>
         </li>
         <li>
           <Link to="/social" onMouseOver={handleWordHover}>
             Social
           </Link>
         </li>
         <NavDropdown className="drop" title="More">
          
           <NavDropdown.Item
             onMouseOver={handleWordHover}
             className="item"
             onClick={handleLogout}
           >
             Log out
           </NavDropdown.Item>
         </NavDropdown>
       </ul>
       <div className="burger" onClick={handleClick}>
         {click ? (
           <FaTimes size={20} style={{ color: "#fff" }} />
         ) : (
           <FaBars size={20} style={{ color: "#fff" }} />
         )}
       </div>
     </div>
     <div className="viewprofile-main">
       <div className="hero">
         <div className="content">
           <h1>
             <img src={logoDark} alt="Match Point" className="Logo-home" />
           </h1>
           <button
             onMouseOver={handleWordHover}
             className="v-button"
             onClick={() => {
               setFontSize(fontSize + 2);
               setFontSizeh3(fontSizeh + 2);
             }}
           >
             + Increase
           </button>
           <button
             onMouseOver={handleWordHover}
             className="v-button"
             onClick={() => {
               setFontSize(fontSize - 2);
               setFontSizeh3(fontSizeh - 2);
             }}
           >
             - Decrease
           </button>
           <h1 style={{ fontSize: `${fontSizeh}px` }} className="h1-title">
             {" "}
             View Profile
           </h1>
           <div>
             <div
               style={{ fontSize: `${fontSize}px` }}
               className="profile-wall"
             >
               <div className="user-profile-container">
                 {isEditing ? (
                   <form
                     className="user-profile-form"
                     onSubmit={handleFormSubmit}
                   >
                     <div className="left-right-holder">
                       <div className="left-side-view">
                         <div className="inner-form">
                           <label
                             onMouseOver={handleWordHover}
                             htmlFor="first_name"
                           >
                             First Name:
                           </label>
                           <input
                             onMouseOver={handleWordHover}
                             type="text"
                             id="first_name"
                             name="first_name"
                             value={userInfo.first_name}
                             onChange={handleInputChange}
                             required
                           />
                         </div>

                         <div className="inner-form">
                           <label
                             onMouseOver={handleWordHover}
                             htmlFor="last_name"
                           >
                             Last Name:
                           </label>
                           <input
                             onMouseOver={handleWordHover}
                             type="text"
                             id="last_name"
                             name="last_name"
                             value={userInfo.last_name}
                             onChange={handleInputChange}
                             required
                           />
                         </div>

                         <div className="inner-form">
                           <label
                             onMouseOver={handleWordHover}
                             htmlFor="last_name"
                           >
                             Username:
                           </label>
                           <input
                             onMouseOver={handleWordHover}
                             type="text"
                             id="username"
                             name="username"
                             value={userInfo.username}
                             onChange={handleInputChange}
                             required
                           />
                         </div>

                         <div className="inner-form">
                           <label onMouseOver={handleWordHover} htmlFor="sport">
                             Sport of choice:
                           </label>
                           <select
                             onMouseOver={handleWordHover}
                             name="sport"
                             onChange={handleInputChange}
                             value={userInfo.sport}
                             required
                           >
                             <option value="CRICKET">Cricket</option>
                             <option value="FOOTBALL">Football</option>

                             <option value="VOLLEYBALL">Volleyball</option>
                             <option value="FIELD_HOCKEY">Field Hockey</option>
                             <option value="TENNIS">Tennis</option>
                             <option value="BASKETBALL">Basketball</option>
                             <option value="TABLE_TENNIS">Table Tennis</option>
                             <option value="BASEBALL">Baseball</option>

                            
                             <option value="GOLF">Golf</option>
                             <option value="RUGBY">Rugby</option>
                             <option value="BADMINTON">Badminton</option>
                             <option value="AMERICAN_FOOTBALL">
                               American Football
                             </option>
                             <option value="SWIMMING">Swimming</option>
                             <option value="GYMNASTICS">Gymnastics</option>
                             <option value="CYCLING">Cycling</option>
                             <option value="ICE_HOCKEY">Ice Hockey</option>
                             <option value="HANDBALL">Handball</option>
                             <option value="BOWLING ">Bowling</option>
                             <option value="ROCK_CLIMBING">
                               Rock Climbing
                             </option>
                             <option value="FRISBEE">Frisbee</option>
                           
                           </select>
                         </div>

                         <div className="inner-form">
                           <label
                             onMouseOver={handleWordHover}
                             htmlFor="skill_level"
                           >
                             Skill Level:
                           </label>
                           <select
                             onMouseOver={handleWordHover}
                             name="skill_level"
                             onChange={handleInputChange}
                             value={userInfo.skill_level}
                             required
                           >
                             <option value="BEGINNER">Beginner</option>
                             <option value="LOWER_INTERMEDIATE">
                               Lower Intermediate
                             </option>
                             <option value="INTERMEDIATE">Intermediate</option>
                             <option value="UPPER_INTERMEDIATE">
                               Upper Intermediate
                             </option>
                             <option value="ADVANCED">Advanced</option>
                           </select>
                         </div>

                         <div className="inner-form">
                           <label
                             onMouseOver={handleWordHover}
                             htmlFor="motivation"
                           >
                             Motivation:
                           </label>
                           <select
                             onMouseOver={handleWordHover}
                             name="motivation"
                             onChange={handleInputChange}
                             value={userInfo.motivation}
                             required
                           >
                             <option value="COMPETITION">Competition</option>
                             <option value="SOCIAL">Social</option>

                             <option value="HEALTH">Health</option>
                             <option value="FUN">Fun</option>
                             <option value="OTHER">Other</option>
                           </select>
                         </div>
                       </div>

                       <div className="right-side-view">
                         <div className="inner-form">
                           <label
                             onMouseOver={handleWordHover}
                             htmlFor="playing_environment"
                           >
                             Playing Enviroment:
                           </label>
                           <select
                             onMouseOver={handleWordHover}
                             name="playing_environment"
                             onChange={handleInputChange}
                             value={userInfo.playing_environment}
                             required
                           >
                             <option value="INDOOR">Indoor</option>
                             <option value="OUTDOOR ">Outdoor</option>
                             <option value="BOTH">Both</option>
                           </select>
                         </div>

                         <div className="inner-form">
                           <label
                             onMouseOver={handleWordHover}
                             htmlFor="location"
                           >
                             Location:
                           </label>
                           <input
                             onMouseOver={handleWordHover}
                             type="text"
                             id="location"
                             name="location"
                             value={userInfo.location}
                             onChange={handleInputChange}
                             required
                           />
                         </div>

                         <div className="inner-form">
                           <label
                             onMouseOver={handleWordHover}
                             htmlFor="gender"
                           >
                             Gender:
                           </label>
                           <select
                             onMouseOver={handleWordHover}
                             name="gender"
                             onChange={handleInputChange}
                             value={userInfo.gender}
                             required
                           >
                             <option value="MALE">Male</option>
                             <option value="FEMALE">Female</option>
                             <option value="OTHER">Other</option>
                           </select>
                         </div>
                         <div className="inner-form">
                           <label
                             onMouseOver={handleWordHover}
                             htmlFor="date_of_birth"
                           >
                             Date of Birth:
                           </label>
                           <input
                             onMouseOver={handleWordHover}
                             className="date-view"
                             type="date"
                             id="date_of_birth"
                             name="date_of_birth"
                             value={userInfo.date_of_birth}
                             onChange={handleInputChange}
                             required
                           />
                         </div>

                         <div className="inner-form">
                           <label onMouseOver={handleWordHover} htmlFor="email">
                             Email Address:
                           </label>
                           <input
                             onMouseOver={handleWordHover}
                             type="email"
                             id="email"
                             name="email"
                             value={userInfo.email}
                             onChange={handleInputChange}
                             required
                           />
                         </div>

                         <div className="inner-form">
                           <label
                             onMouseOver={handleWordHover}
                             htmlFor="phone_number"
                           >
                             Phone Number:
                           </label>
                           <input
                             onMouseOver={handleWordHover}
                             type="tel"
                             id="phone_number"
                             name="phone_number"
                             value={userInfo.phone_number}
                             onChange={handleInputChange}
                             required
                           />
                         </div>
                       </div>
                     </div>
                     <button
                       onMouseOver={handleWordHover}
                       className="save-button"
                       style={{
                         backgroundColor: "#145c0d",
                         color: "#fff",
                         padding: "12px",
                         width: "83%",
                         marginRight: "200px",
                         marginLeft: "200px",
                         border: "none",
                         borderRadius: "8px",
                         cursor: "pointer",
                         marginTop: "20px",
                         fontWeight: "bold",
                         fontSize: "larger",
                       }}
                       type="submit"
                       
                     >
                       Save Changes
                     </button>
                   </form>
                 ) : (
                   <div className="user-profile-details user-profile-view">
                     <div className="left-right-holder2">
                       <div className="left-side-view1">
                         <div className="name-a">
                           <div className="name-a-title">
                             <strong onMouseOver={handleWordHover} className="profile-under">
                               First Name:
                             </strong>{" "}
                           </div>
                           <div onMouseOver={handleWordHover} className="name-a-info">
                             {userInfo.first_name}
                           </div>
                         </div>

                         <div className="name-a">
                           <div className="name-a-title">
                             <strong onMouseOver={handleWordHover} className="profile-under">
                               Last Name:
                             </strong>{" "}
                           </div>
                           <div onMouseOver={handleWordHover} className="name-a-info">
                             {userInfo.last_name}
                           </div>
                         </div>

                         <div className="name-a">
                           <div className="name-a-title">
                             <strong onMouseOver={handleWordHover} className="profile-under">
                               Username:
                             </strong>{" "}
                           </div>
                           <div onMouseOver={handleWordHover} className="name-a-info">
                             {userInfo.username}
                           </div>
                         </div>

                         <div className="name-a">
                           <div className="name-a-title">
                             <strong onMouseOver={handleWordHover} className="profile-under">
                               Sport of choice:
                             </strong>{" "}
                           </div>
                           <div onMouseOver={handleWordHover} className="name-a-info">{userInfo.sport}</div>
                         </div>

                         <div className="name-a">
                           <div className="name-a-title">
                             <strong onMouseOver={handleWordHover} className="profile-under">
                               Skill Level:
                             </strong>{" "}
                           </div>
                           <div onMouseOver={handleWordHover} className="name-a-info">
                             {userInfo.skill_level}
                           </div>
                         </div>

                         <div className="name-a">
                           <div className="name-a-title">
                             <strong onMouseOver={handleWordHover} className="profile-under">
                               Motivation:
                             </strong>{" "}
                           </div>
                           <div onMouseOver={handleWordHover} className="name-a-info">
                             {userInfo.motivation}
                           </div>
                         </div>
                       </div>

                       <div className="right-side-view1">
                         <div className="name-a">
                           <div className="name-a-title">
                             <strong onMouseOver={handleWordHover} className="profile-under">
                               Playing Enviromemnt:
                             </strong>{" "}
                           </div>
                           <div onMouseOver={handleWordHover} className="name-a-info">
                             {userInfo.playing_environment}
                           </div>
                         </div>

                         <div className="name-a">
                           <div className="name-a-title">
                             <strong onMouseOver={handleWordHover} className="profile-under">
                               Location Preference:
                             </strong>{" "}
                           </div>
                           <div onMouseOver={handleWordHover} className="name-a-info">
                             {userInfo.location}
                           </div>
                         </div>

                         <div className="name-a">
                           <div className="name-a-title">
                             <strong onMouseOver={handleWordHover} className="profile-under">Gender:</strong>{" "}
                           </div>
                           <div onMouseOver={handleWordHover} className="name-a-info">{userInfo.gender}</div>
                         </div>

                         <div className="name-a">
                           <div className="name-a-title">
                             <strong onMouseOver={handleWordHover} className="profile-under">
                               Date of Birth:
                             </strong>{" "}
                           </div>
                           <div onMouseOver={handleWordHover} className="name-a-info">
                             {userInfo.date_of_birth}
                           </div>
                         </div>

                         <div className="name-a">
                           <div className="name-a-title">
                             <strong onMouseOver={handleWordHover} className="profile-under">
                               Email Address:
                             </strong>{" "}
                           </div>
                           <div onMouseOver={handleWordHover} className="name-a-info">{userInfo.email}</div>
                         </div>

                         <div className="name-a">
                           <div className="name-a-title">
                             <strong onMouseOver={handleWordHover} className="profile-under">
                               Phone Number:
                             </strong>{" "}
                           </div>
                           <div onMouseOver={handleWordHover} className="name-a-info">
                             {userInfo.phone_number}
                           </div>
                         </div>
                       </div>
                     </div>

                     <button
                     onMouseOver={handleWordHover}
                       className="edit"
                       onClick={() => setIsEditing(true)}
                     >
                       Edit
                     </button>
                   </div>
                 )}
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
};

export default ViewProfile;
