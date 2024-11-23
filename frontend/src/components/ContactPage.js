import '../styles/ContactPage.css';
import React, { Component } from 'react';


class ContactPage extends Component {

  render() {
    return (
      <div className='main-container'>
        <h2>
          Contact Us
        </h2>
        <form target="_blank" action="https://formsubmit.co/daniel.ogidi015@gmail.com" method="POST">
          <div className='form'>
            <div className='form-row'>
              <div className='form-col'>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Full Name"
                  required
                />
              </div>
              <div className='form-col'>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email Address"
                  required
                />
              </div>
            </div>
          </div>
          <div className='form'>
            <textarea className='message' placeholder="Message" rows="10" required></textarea>
          </div>
          <button className='submit' type='submit'>
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default ContactPage;
