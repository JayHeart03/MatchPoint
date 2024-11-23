import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Router } from 'react-router-dom';
import { createBrowserRouter, RouterProvider, Route, Link } from "react-router-dom";
import Login from './Login'
import React from 'react';
import '../styles/HomePage.css'
import Sidebar from '../components/Sidebar';
import logoDark from "../assets/image.png";
import logoLight from "../assets/logo.png";
import '../styles/ContactUs.css'

function ContactUs() {
  return (
    <div>
        
        <div className='homepage-main'>
      
      <div className='hero-contact'>
        <div className='content-contact'>
          <h1><img src={logoDark} alt="Match Point" className="Logo-home" /></h1>
          <h3>Contact Form</h3>
          <form className='contact-form'>


          <div className='con-in-con'>
        <label className='con-la' >Full Name:</label>
        <input className = "con-in" type="text" name="Full Name" id="" placeholder='Enter Full Name' />
        </div>   

        <div className='con-in-con'>
        <label  className='con-la'>Email Adress:</label>
        <input className = "con-in" type="email" name="Email Address" id="" placeholder='Example@Gmail.com' />
        </div>  

        <div className='con-in-con'>
        <label className='con-la'>Phone Number:</label>
        <input className = "con-in" type="phone" name="Phone Number" id="" placeholder='Enter Phone Number' />
        </div>  

        <div className='con-in-con'>
        <label className='con-la'>Message:</label>
        <textarea className = "con-in" name='Message' id="" cols="40" rows = "5" placeholder='Type here....'/>
        </div>   




        <button className ="con-button" type= "submit">Send</button>
         

      </form>
        </div>
      </div>
      <div className='contact-main '>
      
      </div>

      
      
    </div>
    </div>
   

  );
}

export default ContactUs;