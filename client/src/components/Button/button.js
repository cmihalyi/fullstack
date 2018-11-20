import React, { Component } from "react";
import axios from "axios";

export default class Button extends Component {

  render() {
    const {label, clickHandler} = this.props;
    return (
        <button onClick={clickHandler}>
            {label}
        </button>
    );
  }
}
