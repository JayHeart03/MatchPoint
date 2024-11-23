/* eslint-disable */
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Router, useLocation, useNavigate } from 'react-router-dom';
import React from 'react';
import { createBrowserRouter, RouterProvider, Route, Link } from "react-router-dom";
import Sidebar from '../components/Sidebar';
import '../styles/GameLobby.css'

import { useParams } from "react-router-dom";

function withRouter( Child ) {
    return ( props ) => {
      const matchid = useParams();
      console.log("TEST");
      console.log(matchid);
      const location = useLocation();
      const navigate = useNavigate();
      return <Child { ...props } navigate={ navigate } location={ location } matchid={matchid}/>;
    }
  }


class GameLobby extends React.Component {
   
    constructor(props) {
        super(props);
        this.state = {
              token: null,
		      msglist:[],
		      players:[],
		      matchid : null,
		      //images : [""], //this.props.location.state.image, prepare for photo of every player
              title :  "Invalid Title",
		      date :  "Invalid Date",
              location :  "Invalid Location",
              startTime :  "Invalid Start Time",
              endTime :  "Invalid End Time",
              confirmedPlayers: "Invalid Number",
              ageRange: "Invalid Age Range",
              skillRanking: "Invalid Skill Ranking",
              currentUserid: null,
              currentUserPlaying: "Attend",//Attend if not currently attending, and Quit if currently attending
		      token: null,
              status: "Not_Started",
              statusText: "Start Game",
	             };
    }
 
    componentDidMount(Child) {
        //const id = setup();
        console.log(this.props);
        console.log(this.props.matchid.id);

        this.state.matchid = this.props.matchid.id;
        this.setState({ matchid: this.state.matchid });

        //Authorise user with their token
        this.state.token = localStorage.getItem("token"); // Get the token from localStorage
        console.log("token", this.state.token);
        this.setState({token: this.state.token});
        console.log("token", this.state.token);
        
        //this.state.matchid = setup();
        //console.log("NEW MATCH ID: " + this.state.matchid);
        /*
        const  map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            view:   new ol.View({
                center: ol.proj.fromLonLat([2.2, 48]),
                zoom: 4
            })
        });

        var address = this.state.location;
        var url = encodeURI("https://nominatim.openstreetmap.org/search/?q=" + address +"shanghai&format=json&addressdetails=1&limit=5&countrycodes=&accept-language=en")
        var xhr = new XMLHttpRequest();            
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) { 
                    //console.log("The lat/lon is: ", url, xhr.responseText);  
		    if(eval(xhr.responseText).length!=0) {
                        var view  =   map.getView();
                        view.setCenter(ol.proj.fromLonLat([eval(xhr.responseText)[0].lon,eval(xhr.responseText)[0].lat]));
		    }
                }
        };
        xhr.send();
	    

        this.timerID = setInterval(
            () => this.handleRecv(),
            1000
        );
        */

        //Fetch the game info for the game specified in the url
        this.fetchGame();



        //Fetch the players of the game specified in the url
        this.fetchPlayers();

        //Filter the players list and check whether or not the current user is attending
        //If they are attending, change the value of currentUserAttending to "Quit"



        //Fetch the current chatlog (Max previous 50 messages)
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }



    fetchGame() {
        //Fetch the game info for the game specified in the url
        fetch("https://matchpoint.games/api/games/"+this.state.matchid, {
            headers: {
                Authorization: `Token ${this.state.token}`
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log("GAME INFO:");
            console.log(data);
            this.state.title = data.session_title;
            this.state.date = data.date;
            this.state.location = data.location;
            this.state.startTime = data.start_time;
            this.state.endTime = data.end_time;
            this.state.confirmedPlayers = data.confirmed_players;
            this.state.ageRange = data.age_range;
            this.state.skillRanking = data.skill_rating;
            this.state.status = data.status;

            console.log("DATA: " + data.status);

            this.setState({title: this.state.title,
                           date: this.state.date,
                           location: this.state.location,
                           startTime: this.state.startTime,
                           endTime: this.state.endTime,
                           confirmedPlayers: this.state.confirmedPlayers,
                           ageRange: this.state.ageRange,
                           skillRanking: this.state.skillRanking,
                           status: this.state.status,
                        });
            console.log("CHECKING STATUS: " + this.state.status);
            console.log("CHECKING DATA: " + data.status);

            //Set the statusText depending on the value of the status
            if (this.state.status == "Not_Started"){
                this.state.statusText = "Start Game"
            }
            else if (this.state.status == "Started"){
                this.state.statusText = "End Game"
            }
            else if (this.state.status == "Finished") {
                this.state.statusText = "Rate Game!"
            }
            this.setState({statusText: this.state.statusText});            
        })
        .catch(error => {
            console.log(error);
          });

    }

    fetchPlayers() {

        //Get the user id from the token
        fetch("https://matchpoint.games/api/profiles/", {
            method: 'GET',
            headers: {
                Authorization: `Token ${this.state.token}`
            },
        })
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            this.state.currentUserid = data.id;
            this.setState({currentUserid: this.state.currentUserid});
            //console.log(this.state.currentUserid);
        })

        //fetch the players
        fetch("https://matchpoint.games/api/get_game_players/"+ this.state.matchid, {
            method: 'GET',
            headers: {
                Authorization: `Token ${this.state.token}`
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            console.log(data.players);

            this.state.currentUserPlaying = "Attend";
            const formattedPlayers = data.players.map((player) => {
                //Check if the user is already a participant of the game
                if (player.player_id === this.state.currentUserid) {//Add token authentication
                    this.state.currentUserPlaying = "Quit";
                    console.log("TEST TRUE!!!");
                }
                return [player];
            });

            this.state.players = formattedPlayers;
            this.setState({players: this.state.players,
                           currentUserPlaying: this.state.currentUserPlaying
                        });
            console.log("CHANGE CHECK: " + this.state.currentUserPlaying);
        })
        
        .catch(error => {
            console.log(error);
          });

    }



    toggleAttendance(e, id) {
        console.log("TOGGLE SWITCH!!!" + e);
        if (e.target.className == "Attend") {
            //this.state.currentUserPlaying = "Quit";
            //Add user to the players table
            fetch('https://matchpoint.games/api/add-player/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${this.state.token}`,
                },
                body: JSON.stringify({
                  game_id: this.state.matchid,
                  user_id: this.state.currentUserid,//Add the authentication with the token
                }),
              })
                .then(response => {
                  if (response.ok) {
                    // handle success
                    console.log("PLAYER ADDED!!!");
                  } else {
                    // handle error
                    console.log("PLAYER NOT ADDED!!!");
                  }
                })
                .catch(error => {
                  // handle error
                  console.log("ERROR!!!");
                });
            //Re-fetch the players to add the new player to the list displayed to the user
            this.fetchPlayers();
            e.target.className = this.state.currentUserPlaying;
        }
        else if (e.target.className == "Quit") {
            //this.state.currentUserPlaying = "Attend";This should be validated within the fetchPlayers function
            //Remove user from the players table
            fetch('https://matchpoint.games/api/remove-player/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${this.state.token}`,
                },
                body: JSON.stringify({
                  game_id: this.state.matchid,
                  user_id: this.state.currentUserid,//Add the authentication with the token
                }),
            })
            .then(response => {
                if (response.ok) {
                    // handle success
                    console.log("PLAYER REMOVED!!!");
                }
                else {
                    // handle error
                    console.log("PLAYER NOT REMOVED!!!");
                }
            })
            .catch(error => {
                // handle error
                console.log("ERROR!!!");
            });
            //Re-fetch the players to add the new player to the list displayed to the user
            this.fetchPlayers();
            e.target.className = this.state.currentUserPlaying;
        }
        //this.setState({currentUserPlaying: this.state.currentUserPlaying});
        console.log(this.state.currentUserPlaying);
    }

    toggleGameStatus(e) {
        console.log("TOGGLE GAME STATUS!!!" + e);
        if (e.target.className == "Not_Started") {
            //this.state.status = "Started";//This should be performed within the fetchGame() function
            //Here, the status text doesn't need to be updated, 
            //Since this change is performed in the fetchGame function

            //Update the game status
            fetch(`https://matchpoint.games/api/update-game-status/${this.state.matchid}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    status: 'Started'
                })
            })
            .then(response => {
                if (response.ok) {
                    // handle success
                    console.log("GAME UPDATED!!!");
                }
                else {
                    // handle error
                    console.log("GAME NOT UPDATED!!!");
                }
            })
            .catch(error => {
                // handle error
                console.log("ERROR!!!");
            });

            //Re-fetch the game to ensure that the most up-to-date information is displayed
            this.fetchGame();
            e.target.className = this.state.status;
        }
        else if (e.target.className == "Started") {
            //e.target.className = "Finished";
            //this.state.status = "Finished";
            //Update the status of the game
            //Update the game status
            fetch(`https://matchpoint.games/api/update-game-status/${this.state.matchid}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    status: 'Finished'
                })
            })
            .then(response => {
                if (response.ok) {
                    // handle success
                    console.log("GAME UPDATED!!!");
                }
                else {
                    // handle error
                    console.log("GAME NOT UPDATED!!!");
                }
            })
            .catch(error => {
                // handle error
                console.log("ERROR!!!");
            });

            //Re-fetch the game to ensure that the most up-to-date information is displayed
            this.fetchGame();
            e.target.className = this.state.status;
            //Re-fetch the game to ensure that the most up-to-date information is displayed
        }
        else if (e.target.className == "Finished"){
            console.log("IMPLEMENT RATINGS BUTTON!!!");
        }
        //this.setState({status: this.state.status});
        console.log(this.state.status);
    }




        /*
        console.log("STARTING GAME!!!");
        e.target.style.display = 'none';
        //Remove the game from the game listing
        fetch(`https://matchpoint.games/api/remove-game/${this.state.matchid}/`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              //'Authorization': `Token ${token}`,//Not implemented yet
            },
          })
            .then(response => {
              if (response.ok) {
                // handle success
                console.log("GAME REMOVED!!!");
              } else {
                console.log("GAME NOT REMOVED!!!");
                // handle error
              }
            })
            .catch(error => {
              // handle error
              console.log("ERROR!!!");
            });
        */


    handleRecv= ()=>{
	// get chat-msg
        fetch("https://matchpoint.games/api/chatmsg/"+this.state.matchid)
        .then(response=>response.json())
        .then(
             (result) => {
                  this.setState({
                       msglist: result.msglist
                  });
             },

             (error) => {
		  console.log("get chatmsg error:"+error);
             }
        )

    }

    handleSend = (e) => {
        const messageText = document.getElementById('msgeditbox').value;
        const chatBox = document.getElementById('msgbox');
        //const isScrolledToBottom = chatBox.scrollHeight - chatBox.clientHeight <= chatBox.scrollTop + 1;
      
        chatBox.innerHTML += '<div class="colorred"> Harry: '+messageText+'</div>';
        document.getElementById('msgeditbox').value = "";

	// send chat-msg
        fetch("https://matchpoint.games/api/chatmsg/"+this.state.matchid, {method:'post',headers:{"Content-Type":"application/json"},body:JSON.stringify({matchid:this.state.matchid, msg:messageText, token:this.state.token})})
        .then(response=>response.json())
        .then(
             (result) => {
                  console.log("send ok, resp is:"+result);
                  this.setState({
                  });
             },

             (error) => {
		  console.log("send msg error:"+error);
             }
        )

        //this.serverRequest = $.post("http://101.35.231.97/api/chatmsg", function (result) {
	 //   var msglist = eval(result);
          //  this.setState({
           //     msglist: msglist
            //});
        //}.bind(this));	
      
    }
      
    handleStart = (e) => {
        // document.getElementById('msgbox').innerHTML=document.getElementById('msgbox').innerHTML + "<br/>The host has started the game!";
	// send start-msg
        fetch("https://matchpoint.games/api/chatmsg/"+this.state.matchid, {method:'post',headers:{"Content-Type":"application/json"},body:JSON.stringify({matchid:this.state.matchid,msg:"<br/>The host has started the game!",token: this.state.token})})
        .then(response=>response.json())
        .then(
             (result) => {
                  console.log("send match start ok, resp is:" + result);
                  this.setState({
                  });
             },

             (error) => {
		  console.log("send match start msg error:" + error);
             }
        )
    }

    render() {

    return (
        <div>
            <Sidebar/>

            <div className='gamelobby-main'>
                <div className='gamelobby-container'>
                    <div className='gamelobby-left'>

                        <div className='gamelobby-left-up'>
                            <div className='gamelobby-title'>
                                <h3 className="gamename"> {this.state.title} </h3>
                            </div>

                            <div className='players-in-game'>
                                <div className="players-rows">
                                    {this.state.players.map((player, index) => {
                                        //console.log(this.state.players);
                                        //console.log("PLAYER:");
                                        //console.log(player);
                                        //console.log(player[0].player_name);
                                        //console.log(index);
                                        return (
                                            <div key={index} className='user-pic-container'>
                                                <div className='user-name'>
                                                    <h6 className="cardtitle">{player[0].player_username}</h6>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                        </div>
        
                        <div className='gamelobby-left-bottom'>
                            <div className='gamechat'>
                                <div class="chatbox">
                                    <div class="text-chat">
                                        <div class="col-12" id = "msgbox" >
                                            {this.state.msglist.map((value, index) => {
                                                return (<div key={index} className="colorred">{value}</div>) })}
                                        </div>
                                    </div>
                
                                    <div class="input-chat">
                                        <input id ="msgeditbox" class="input-chatbox" placeholder="Please input message..." />
                                        <button class="button-chat" onClick={this.handleSend}>Send</button>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>



                        <div className='gamelobby-right'>
                            <div className='gamelobby-right-up-title'>
                                <h6 className="infotitle"> Location </h6>
                            </div>

                            <div className='gamelobby-right-up-map' id='map'>
                            </div>

                            <div className='gamelobby-right-up-description'>
                                <h6 className="infoaddr">{this.state.location}</h6>
                            </div>

                            <div className='gamelobby-right-up-date'>
                                <div className='content-1'>
                                    <button className="infobuttonleft"><b>Game Date:</b></button>
                                </div>

                                <div className='title-1'>
                                    <button className="infobuttonright">{this.state.date}</button>
                                </div>
                            </div>


                            <div className='gamelobby-right-up-time'>
                                <div className='content-1'><button className="infobuttonleft"><b>Game Time:</b></button></div>
                                <div className='title-1'><button className="infobuttonright">{this.state.startTime + '-' + this.state.endTime}</button></div>
                            </div>


                            <div className='gamelobby-right-up-age'>
                                <div className='content-1'><button className="infobuttonleft"><b>Age Range:</b></button></div>
                                <div className='title-1'><button className="infobuttonright">{this.state.ageRange}</button></div>
                            </div>

                            <div className='gamelobby-right-up-skill'>
                                <div className='content-1'><button className="infobuttonleft"><b>Skill Level:</b></button></div>
                                <div className='title-1'><button className="infobuttonright">{this.state.skillRanking}</button></div>
                            </div>


                            <div className='gamelobby-right-up-players'>
                                <div className='content-1'><button className="infobuttonleft"><b>Confirmed Players:</b></button></div>
                                <div className='title-1'><button className="infobuttonright">{this.state.confirmedPlayers}</button></div>
                            </div>


                            <div className='gamelobby-right-up-attend-or-quit'>
                                <button className={this.state.currentUserPlaying} onClick={e => this.toggleAttendance(e)}> {this.state.currentUserPlaying} </button>
                            </div>

                            <div className='gamelobby-right-up-start-game'>
                                <button className={this.state.status} onClick={e => this.toggleGameStatus(e)}> {this.state.statusText} </button>
                            </div>




                        </div>
                </div>

            </div>
        </div>
        );
    }
}

export default withRouter(GameLobby);
