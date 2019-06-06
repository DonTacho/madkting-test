import React, { Component } from 'react';
import logo from '../img/logo-madkting.png';
import '../App.css';

export default class Header extends Component {
  render() {
    return (
        <header className="madkting-header">
            <div className="logo-box">
            <img src={logo} className="logo" alt="logo" />
            </div>
          </header>
      );
  }
}