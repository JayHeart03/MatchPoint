import React, { Component } from 'react';
import PropTypes from "prop-types";
//import '../styles/Game.css';
import '../styles/JoinGame.css';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

class Game extends Component {

  
  render(props) {

    //Format the image prop to point to the correct location so that the image is displayed
    //console.log(this.props);
    const string = '../images/' + this.props.sport + '.png';
    //console.log(string);
    //console.log(this.props.date);

    //Format the date so that is displays correctly
    const date = new Date(this.props.date);
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    });
    //console.log(formattedDate); // Output: DD/MM/YYYY


    //Format the time strings so that they are displayed correctly
    var hours = 0;
    var minutes = 0;

    //startTime
    var time_array = this.props.startTime.split(":");
    hours = time_array[0];
    minutes = time_array[1];
    const formattedStartTime = hours + ":" + minutes;
    //console.log(formattedStartTime); // Output: HH:MM

    //endTime
    time_array = this.props.endTime.split(":");
    hours = time_array[0];
    minutes = time_array[1];
    const formattedEndTime = hours + ":" + minutes;
    //console.log(formattedEndTime); // Output: HH:MM
    

    //Test the props to ensure there are no undefined fields
    //console.log("GAME_PROPS!");
    //console.log(this.props.match_id);

    return (
      <Link className="games-button" to={'/GameLobby/' + this.props.match_id}>
        <div className="game-listing">
          <div className="left-section-image" id="Game-Column-0">
            <img id="Image" src={string} alt={this.props.sport} />
          </div>

          <div className="right-section-text">
            <div className="column-1">
              <div id="Game-Name">
                <h4 className="title-game" id="Title" style={this.props.titleStyle}>{this.props.title}</h4>
                <h6 id="Organisation" style={this.props.organisationStyle}>{this.props.organisation}</h6>
              </div>
              <p id="Description">{this.props.game_description}</p>
            </div>

            <div className="column-2">
              <span id="Date">
                <strong>Date:</strong> {formattedDate}
              </span>
              <p id="Location"><strong>Location:</strong>  {this.props.location}</p>
            </div>

            <div className="column-3">
              <time id="Time">
              <strong>Time:</strong>  {formattedStartTime}-{formattedEndTime}
              </time>
              <p className="Compatibility-High">
              <strong>Compatibility Rank:</strong>  {this.props.compatibility}
              </p>
            </div>
          </div>
        </div>
      </Link>
    );
  }
}
Game.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired
}
 
export default Game;

