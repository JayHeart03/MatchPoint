import "../styles/CreateAccount.css";
import React, { useState } from "react";
import Login from "./Login";
import "react-datepicker/dist/react-datepicker.css";

function CreateAccount(props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [sport, setSport] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [motivation, setMotivation] = useState("");
  const [playingEnvironment, setPlayingEnvironment] = useState("");

  const [accountCreated, setAccountCreated] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    console.log("handleSubmit called");
    console.log("firstName:", firstName);
    console.log("lastName:", lastName);
    console.log("userName:", userName);
    console.log("email:", email);
    console.log("gender:", gender);
    console.log("phoneNumber:", phoneNumber);
    console.log("password:", password);
    console.log("dateOfBirth:", dateOfBirth);
    console.log("sport:", sport);
    console.log("skillLevel:", skillLevel);
    console.log("motivation:", motivation);
    console.log("playingEnvironment:", playingEnvironment);

    event.preventDefault();
    if (
      !firstName ||
      !lastName ||
      !userName ||
      !email ||
      !gender ||
      !phoneNumber ||
      !password ||
      !dateOfBirth ||
      !sport ||
      !skillLevel ||
      !motivation ||
      !playingEnvironment 
    ) {
      setErrorMessage("Please fill out all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return;
    }
 
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setErrorMessage("Please enter a valid phone number");
      return;
    }

    const today = new Date(); // get today's date
    const minDob = new Date(today.getFullYear() - 99, today.getMonth(), today.getDate()); // calculate minimum date based on 99 years ago
    const maxDob = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()); // calculate maximum date based on 18 years ago

    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime()) || dob < minDob || dob > maxDob) {
      setErrorMessage("Please enter a valid date of birth between 18 and 99 years");
      return;
    }

    if (!userName) {
      setErrorMessage("Username is required");
      return;
    }
    
    fetch(`https://matchpoint.games/api/check-username/${userName}`)
      .then(response => response.json())
      .then(data => {
        if (data.exists) {
          setErrorMessage("Username already exists");
        }
      })
      .catch(error => {
        console.error(error);
        setErrorMessage("Something went wrong while checking the username");
      });
    
    
    try {
      const response = await fetch("https://matchpoint.games/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          username: userName,
          gender,
          phone_number: phoneNumber,
          password,
          date_of_birth: dateOfBirth,
          sport: sport,
          skill_level: skillLevel,
          motivation,
          playing_environment: playingEnvironment,
        }),
      });

      if (response.status === 400) {
        setErrorMessage("An account with this email already exists. Please use a different email or sign in.");
        return;
      }
      
      if (!response.ok) {
        const error = await response.json();
        setErrorMessage(error.detail);
        return;
      }

      // Success! Set accountCreated to true
      setAccountCreated(true);
    } catch (error) {
      console.error(error);
      setErrorMessage("Error Occured try again");
    }
  };

  // If accountCreated is true, redirect to the Login component
  if (accountCreated) {
    return <Login />;
  }

  return props.trigger ? (
    <div className="createAccount">
      <form className="create-account-form" onSubmit={handleSubmit}>
        <div className="create-account-input">
          <label className="create-accounts-labels">First Name:</label>
          <input
            className="create-account-inputs"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </div>

            <div className="create-account-input">
            <label className="create-accounts-labels">Last Name:</label>
            <input
              className="create-account-inputs"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>

          <div className="create-account-input">
            <label className="create-accounts-labels">Username:</label>
            <input
              className="create-account-inputs"
              type="text"
              placeholder="Username "
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

      
          <div className="create-account-input">
            <label className="create-accounts-labels">Email:</label>
            <input
              className="create-account-inputs"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="create-account-input">
            <label className="create-accounts-labels">Password:</label>
            <input
              className="create-account-inputs"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
      
          <div className="create-account-input">
            <label className="create-accounts-labels">Gender:</label>
            <select className="create-account-inputs" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

      
          <div className="create-account-input">
            <label className="create-accounts-labels">Phone Number:</label>
            <input
              className="create-account-inputs"
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
            />
          </div>

                  <div className="create-account-input">
          <label className="create-accounts-labels">Date of Birth:</label>
          <input
            className="create-account-inputs"
            type="date"
            placeholder="Date of Birth"
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
            pattern="\d{4}-\d{2}-\d{2}"
            required
          />
        </div>

          <div className="create-account-input">
          <label className="create-accounts-labels">Sport of Choice:</label>
          <select className="create-account-inputs" value={sport} onChange={(e) => setSport(e.target.value)}>
          <option value="NOCHOICE">Select Sport</option>
          <option value="CRICKET">Cricket</option>
          <option value="FOOTBALL">Football</option>
          <option value="VOLLEYBALL">Volleyball</option>
          <option value="FIELD_HOCKEY">Field Hockey</option>
          <option value="TENNIS">Tennis</option>
          <option value="BASKETBALL">Basketball</option>
          <option value="BASEBALL">Baseball</option>
          <option value="GOLF">Golf</option>
          <option value="RUGBY">Rugby</option>
          <option value="BADMINTON">Badminton</option>
          <option value="AMERICAN_FOOTBALL">American Football</option>
          <option value="SWIMMING">Swimming</option>
          <option value="GYMNASTICS">Gymnastics</option>
          <option value="CYCLING">Cycling</option>
          <option value="ICE_HOCKEY">Ice Hockey</option>
          <option value="HANDBALL">Handball</option>
          <option value="ROCK_CLIMBING">Rock Climbing</option>
          <option value="FRISBEE">Frisbee</option>
          <option value="BOWLING">Bowling</option>
          </select>
        </div>

             

          <div className="create-account-input">
            <label className="create-accounts-labels">Motivation:</label>
            <select
              className="create-account-inputs"
              value={motivation}
              onChange={(event) => setMotivation(event.target.value)}
            >
              <option value="" disabled hidden>
                Select motivation
              </option>
              <option value="FUN">Fun</option>
              <option value="SOCIAL">Social</option>
              <option value="HEALTH">Health</option>
              <option value="COMPETITION">Competition</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="create-account-input">
          <label className="create-accounts-labels">Playing Environment:</label>
          <select className="create-account-inputs" value={playingEnvironment} onChange={(e) => setPlayingEnvironment(e.target.value)}>
            <option value="">Select environment</option>
            <option value="INDOOR">Indoor</option>
            <option value="OUTDOOR">Outdoor</option>
            <option value="BOTH">Both</option>
          </select>
        </div>

        <div className="create-account-input">
        <label className="create-accounts-labels">Skill Level:</label>
        <select className="create-account-inputs" value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)}>
          <option>Select rating</option>
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="UPPER_INTERMEDIATE">Upper Intermediate</option>
          <option value="LOWER_INTERMEDIATE">Lower Intermediate</option>
          <option value="ADVANCED">Advanced</option>
                  </select>
      </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button className="create-account-button" type="submit">
                  Create Account
                </button>
                <button
            className="close-create-button"
            onClick={() => props.setTrigger(false)}
          >
            Close
          </button>
              </form>
            </div>
            
            ) : (
              ""
              );
              }
              
              export default CreateAccount;
                        
                
