import React, { Component } from "react";
import Player from "./Player";

const ballBuddies = [
  "76561197995010826",
  "76561198016163269",
  "76561197996271106"
];

export class Players extends Component {
  render() {
    return (
      <div>
        {ballBuddies.map((id) => {
          return <Player key={id} playerId={id} />;
        })}
      </div>
    );
  }
}

export default Players;
