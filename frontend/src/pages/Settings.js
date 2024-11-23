import '../styles/Settings.css';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Settings extends Component {

  render() {
    return (
      <div className='main-container'>
        <div>
            Text Size
        </div>
        <div>
            Language
        </div>
        <div>
            VoiceOver
        </div>
        <div className="contact-link">
            <Link to="/ContactPage">Contact Us</Link>
        </div>
      </div>
    );
  }
}

export default Settings;
