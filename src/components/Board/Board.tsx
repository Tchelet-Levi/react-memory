import React from "react";
import Card from "../Card/Card";
import "./Board.scss";

function Board(props: any) {
  const isInMenu = props.gameState === "MENU";

  return (
    <div
      className={`board-wrapper ${isInMenu && !props.hasWon ? "in-menu" : ""} ${
        props.hasWon ? "game-visible" : ""
      }`}>
      <div className={`board`}>{props.children}</div>
    </div>
  );
}

export default Board;
