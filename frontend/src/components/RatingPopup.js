import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import '../styles/RatingPopup.css';

const RatingPopup = () => {
  const [rating, setRating] = useState(0);
  const [showPopup, setShowPopup] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const GAME_ID = urlParams.get('gameid');
  console.log("TEST: " + GAME_ID);

  //const GAME_ID = 1;//it is a constant one now, needs to change to gameid

  useEffect(() => {
    if (!showPopup) {
      const token = localStorage.getItem('token');

      // send a POST request to the API with the rating value and game ID
      fetch('https://matchpoint.games/api/game_rankings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          game_id: GAME_ID,//the change will apply here and the game id will be sent to the api
          rating: rating
        })
      })
      .then(response => {
        if (response.ok) {
          console.log('Rating added successfully!');
        } else {
          console.error('Error adding rating:', response.statusText);
        }
        window.location.href = "https://matchpoint.games/GameLobby/" + GAME_ID;//redirect to GameLobby/gameid
      })
      .catch(error => {
        console.error('Error adding rating:', error);
      });

    }
  }, [showPopup, rating]);

  const handleRating = (value) => {
    setRating(value);
    setShowPopup(false);
  };

  return (
    <>
      {showPopup && (
        <div className="rating-popup">
          <div className="popup-box">
            <h2 className="popup-title">Rate the Game</h2>
            <div className="stars-container">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <div
                    key={ratingValue}
                    onClick={() => handleRating(ratingValue)}
                    style={{ display: 'inline-block', margin: '5px' }}
                  >
                    <FaStar
                      className="star"
                      color={ratingValue <= rating ? '#ffc107' : '#e4e5e9'}
                      onMouseEnter={() => setRating(ratingValue)}
                      onMouseLeave={() => setRating(0)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {!showPopup && <div className="white-page"></div> //should be modified such that the white screen does not appear, aesthetic changes
      } 
    </>
  );
};

export default RatingPopup;



