// src/components/Toolbar.js
import React from "react";
import "./drawingboard.css";
import "bootstrap/dist/css/bootstrap.css";


const Toolbar = ({
  onToolChange,
  onColorChange,
  onBackgroundChange,
  onClear,
}) => {
  return (
    <div className="toolbar mb-3 d-flex align-items-center justify-content-center">
      <p className="me-2 name-tools">Tool:</p>
      <select onChange={(e) => onToolChange(e.target.value)}>
        <option value="pen">Pen</option>
        <option value="marker">Marker</option>
        <option value="highlighter">Highlighter</option>
        <option value="brush">Brush</option>
        <option value="eraser">Eraser</option>
      </select>
      <p className="me-2 name-tools">Tool color:</p>
      <select onChange={(e) => onColorChange(e.target.value)}>
        <option value="black">Black</option>
        <option value="white">White</option>
        <option value="blue">Blue</option>
        <option value="green">Green</option>
        <option value="red">Red</option>
        <option value="yellow">Yellow</option>
      </select>
      <p className="me-2 name-tools">Background color:</p>
      <select onChange={(e) => onBackgroundChange(e.target.value)}>
        <option value="white">White</option>
        <option value="black">Black</option>
        <option value="lightblue">Light Blue</option>
        <option value="lightgreen">Light Green</option>
      </select>
      <button className="login-btn edit-btn ms-2" onClick={onClear}>
        Clear
      </button>
    </div>
  );
  };

  export default Toolbar;
