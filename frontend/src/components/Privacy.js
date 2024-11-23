import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Router } from 'react-router-dom';
import { createBrowserRouter, RouterProvider, Route, Link } from "react-router-dom";
import Login from './Login'
import React, { useState } from 'react';
import '../styles/HomePage.css'
import Sidebar from './Sidebar';
import logoDark from "../assets/image.png";
import logoLight from "../assets/logo.png";
import '../styles/Privacy.css'
import HomePage from '../pages/HomePage';

function ContactForm() {

  return (

    <div>
        
    <div className='homepage-main'>
      
      <div className='hero-privacy'>
        <div className='content-privacy'>
          <h1><img src={logoDark} alt="Match Point" className="Logo-home" /></h1>
          <h3>GDPR Privacy Policy</h3>
          </div>
          <div className='content-privacy2'>
          <p > At MatchPoint, we are committed to protecting your personal information and your right to privacy. 
            This privacy policy describes how we collect, use, and share information when you use our web-app.</p>
            <h5> Information We Collect:</h5>
            <p>We collect personal information provided by you, this is collected when you sign up for an account.</p>
            <p> The information collected by includes but is not limited to:</p>
            <ul>
  <li>Full Name</li>
  <li>Email Address</li>
  <li>Phone Number</li>
  <li>Age</li>
  <li>Gender</li>
  <li>Sport of Interest</li>
  <li>Skill Level</li>
  <li>Play Frequency</li>
  <li>Competitiveness</li>
  <li>Preferred Play Location</li>
  <li>Participation within Games</li>
  <li>Connections with friends</li>
</ul>
<h5> Data Storage:</h5>
<p> MatchPoint stores user’s data whilst they have an active account on the system. This is to provide the correct functionality required for 
  the ideal user experience and to obey legal obligations. This data is stored on MatchPoint’s servers. Upon deletion of a user account, corresponding 
  user and participation data will be deleted from our database. This is subject to exceptions based on legal or operational purposes.
MatchPoint may also collect user feedback through various surveys for statistical and analytical purposes. This data is used to improve app functionality
 and user experience, and will be completely anonymous so that it cannot be used to reconstruct personal user information.
</p>
<h5> Data Usage:</h5>
<p>MatchPoint uses personal data provided by a user during the signup process to connect with other users based on their profile 
  features as well as providing recommend games to users that match their interests and preferences. Here, a user’s contact details
   are shared between other participating users when organising a game for seamless communication. Furthermore, MatchPoint will also
    store the results of games, as well as the users who participated. The amount of data collected is dependent on 
  the number of games that a user participates in. This information will then be updated as the user completes the games, meaning the 
  frequency of data collection will depend on how often the users participate in games. </p>
  <h5> Data Retention:</h5>
  <p>MatchPoint app retains the user's personal data for as long as the user has an active account, 
     to provide the services offered by the app and comply with legal obligations. This personal data
      provided by a user is not shared with any third-party app or for marketing purposes, and is removed 
      from the database upon the deletion of a user’s account. The user may delete their account and personal 
      data at any time after which their details are removed from the system. </p>
      <h5> Security of Your Information</h5>
      <p> We at MatchPoint take ideal, reasonable measures to ensure only authorised users can access their account.
         However, no application can guarantee complete security of your information forever, this is also the case with MatchPoint. 
         We aim to always protect user data to highest possible extent.</p>
         <h5> Your Rights:</h5>
         <p> Users always have the right to view, update and delete their information on the app. 
          This can be done by logging in and editing your profile. Users also have the right to 
          object to sharing their information to third party services via cookies.  
          Please note that deleting your account may not completely remove all your information
           from our system, as we may retain certain information for legal or operational purposes.</p>
           <h5>What are Cookies? </h5>
           <p>Cookies are small files sent by your web browser by a website you visit.
             A cookie file is stored in your web browser and allows a service provider 
             or a third-party to recognise your device and remember information from previous 
             visits to a webpage. This can make your next visit more efficient and personalised, 
             meaning the service can be more useful to you.Cookies can be "persistent" or "session" 
             cookies. Persistent cookies remain on your personal computer or mobile device when you
              go offline, while session cookies are deleted as soon as you close your web browser.</p>
              <h5> How MatchPoint Uses Cookies</h5>
              <p> When you use and access the MatchPoint, we may place several cookies files in your web browser.</p>
              <p> Cookies are used for the following purposes:</p>
              <ul>
  <li>Ensure ideal functionality for user experience and remember a user’s preferences.</li>
  <li>To provide analytics to improve MatchPoint’s services.</li>
  <li>To remember the last page visited by a user’s profile.</li>
</ul>
<p> MatchPoint uses both session and persistent cookies, different types of cookies are used to run the application:</p>
<h5>Essential cookies:</h5>
<p> Cookies that are classed as essential are required to run the webpage, and provide the user with the best experience on the 
  application during the session. Some of these cookies enable services that help authenticate users and prevent unauthorized access.
   Without these cookies, the correct functionality of the application cannot be guaranteed.</p>
   <h5>Analytics cookies:</h5>
   <p> These cookies allow MatchPoint to collect information on the website’s usage during each user session. These may include
     time spent on a particular page, hyperlinks used, etc. This information is used as statistics to improve the application. 
     Analytical cookies do not collect any specific personal information that can identify a user.</p>
   <h5> Preference cookies:</h5>
   <p> These cookies allow us to save your preferences and settings, such as your preferred language. This enables MatchPoint to personalise a user’s experience on the website.</p>
   <h5>Third-party Cookies:</h5>
   <p> In addition to our own cookies, we may also use third-party cookies to report usage statistics of the Service and other services. These cookies are only turned on if the user accepts their usage on their account.</p>
   <h5> What are your choices regarding cookies?</h5>
   <p> If you would like to delete cookies or instruct your web browser to 
    delete or refuse cookies, please visit the help pages of your web browser.
However, please note that upon deletion of certain cookies or refusal to accept
 them, this may hinder the application’s performance and our ability to store your preferences with your account.</p>
 <h5> Where can you find more information about cookies?</h5>
 <h5> You can learn more about cookies here:</h5>
 <h5>AllAboutCookies:</h5>
 <p> <a className='cook-more' href="http://www.allaboutcookies.org/">http://www.allaboutcookies.org/</a></p>
 <h5>Changes to this Cookie Policy: </h5>
 <p> Our Cookie Policy might be updated with time. Any updates will be notified to you on the application.</p>
 <h5> Privacy Policy Updates:</h5>
 <p> MatchPoint app reserves the right to update this privacy policy at any time to reflect changes in the app's features, functionality, or legal obligations. If there were to be any updates to MatchPoint’s privacy policy, the user will be notified via an email and an app notification.
The user's continued use of the app after the updated privacy policy has been published constitutes their acceptance of the updated privacy policy.</p>
<p> This privacy policy is effective as of [14/03/2023] and was last updated on [14/03/2023].</p>
<h5> Contact Us:</h5>
<p> If you have any concerns or complaints about our privacy policy or the way we handle your personal information,
   feel free to get contact us at privacy@matchpoint.com. Here at MatchPoint your privacy is taken seriously, and we will work to 
   address any concerns you may have.</p>
   <h5> Contact Details:</h5>
   <p className='emails-privacy'>Bharath Sadineni:</p>
   <p>bxs006@student.bham.ac.uk</p>
   <p className='emails-privacy'>Daniel Monday-Ogidi </p>
   <p>dcm037@student.bham.ac.uk</p>
   <p className='emails-privacy'>Gregor Edwards</p>
   <p>gxe124@student.bham.ac.uk</p>
   <p className='emails-privacy'>Mohammad Qashmar</p>
   <p>mxq034@student.bham.ac.uk</p>
   <p className='emails-privacy'>Ruslan el-Rabayah </p>
   <p>rxe162@student.bham.ac.uk</p>
   <p className='emails-privacy'>Jingzhen Wu</p>
   <p>jxw1390@student.bham.ac.uk</p>
   <p className='emails-privacy'>Qinyu Chen</p>
   <p>qxc102@student.bham.ac.uk</p>
   <p className='emails-privacy'>Yuchen Zhu</p>
   <p>yxz1225@student.bham.ac.uk</p>

 






            </div>
        
      </div>
      
      
    </div>

      

    </div>
  
   

  );
}

export default ContactForm;