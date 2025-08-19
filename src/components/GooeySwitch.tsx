import React from "react";
import "../styles/GooeySwitch.css";

type GooeySwitchProps = {
  isCelsius: boolean;
  onToggle: () => void;
};

export const GooeySwitch: React.FC<GooeySwitchProps> = ({ isCelsius, onToggle }) => {
  return (
    <div className="gooey-toggle">
       <input
        type="checkbox"
        id="gooey"
        className="toggle-input"
        checked={!isCelsius}
        onChange={onToggle}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 292 142"
        className="toggle"
      >
        <g filter="url(#goo)">
          <rect
            fill="#000"
            rx="58"
            height="58"
            width="116"
            y="42"
            x="0"
            className="toggle-circle-center"
          />
          <rect
            fill="#000"
            rx="50"
            height="114"
            width="150"
            y="14"
            x="2"
            className="toggle-circle left"
          />
          <rect
            fill="#000"
            rx="58"
            height="114"
            width="150"
            y="14"
            x="140"
            className="toggle-circle right"
          />
        </g>

        <filter id="goo">
          <feGaussianBlur stdDeviation="5" result="blur" in="SourceGraphic" />
          <feColorMatrix
            result="goo"
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  
                    0 1 0 0 0  
                    0 0 1 0 0  
                    0 0 0 18 -7"
          />
        </filter>
      </svg>
      <span className="text-C" >°C</span>
      <span className="text-F" >°F</span>
    </div>
  );
};