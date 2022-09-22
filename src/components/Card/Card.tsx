import React, { useEffect, useRef, useState } from "react";
import "./Card.scss";

type CardProps = {
  char: string;
  isFlipped: boolean;
  handleClick: any;
  winAnimIdx?: number;
  totalCards: number;
};

function Card({ char, isFlipped, handleClick, winAnimIdx, totalCards }: CardProps) {
  const indexVariable = {
    "--flip-idx": winAnimIdx,
    "--total-number-of-cards": totalCards,
  } as React.CSSProperties;

  return (
    <div
      className={`card-wrapper ${winAnimIdx ? "flip-360" : ""}`}
      onClick={handleClick}
      style={indexVariable}>
      <div className={`card ${isFlipped && "flipped"}`}>
        <div className="card-front">
          <span className="char">{char}</span>
          <span className="char-shadow">{char}</span>
        </div>
        <div className="card-back"></div>
      </div>
    </div>
  );
}

export default Card;
