import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Router } from "react-router-dom";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Login from "../components/Login";
import React from "react";
import "../styles/HomePage.css";
import logoDark from "../assets/image.png";
import logoLight from "../assets/logo.png";

function HomePage() {
  return (
    <div className="homepage-main">
      <div className="hero">
        <div className="content">
          <h1>
            <img src={logoDark} alt="Match Point" className="Logo-home" />
          </h1>
          <p className="p-1">Where sports meets socializing</p>
          <p className="p-2">Join the game today</p>
          <div>
            <Link to="/contactus" className="home-button">
              Contact Us
            </Link>
            <Link to="/policy" className="home-button">
              Privacy Policy
            </Link>
          </div>
          <Login />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
