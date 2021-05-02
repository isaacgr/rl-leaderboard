import React, { Fragment } from "react";
import { useQuery, gql } from "@apollo/client";

const PLAYER_QUERY = gql`
  query PlayerQuery($id: String!) {
    player(id: $id) {
      platformInfo {
        platformUserHandle
        avatarUrl
      }
      overview {
        wins {
          value
        }
        goals {
          value
        }
        saves {
          value
        }
        assists {
          value
        }
        mVPs {
          value
        }
        shots {
          value
        }
      }
    }
  }
`;

const Player = ({ playerId }) => {
  const { loading, error, data } = useQuery(PLAYER_QUERY, {
    variables: { id: playerId }
  });
  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log(error);
    return <p>Error :(</p>;
  }
  console.log(data);
  return (
    <div>
      <Fragment>
        <div className="card card-body mb-3">
          <div className="row">
            <div className="col-md-9">
              <img
                alt="img"
                src={data.player.platformInfo.avatarUrl}
                style={{ width: 100, display: "block" }}
              />
              <h4>Player: {data.player.platformInfo.platformUserHandle}</h4>
              <p>Wins: {data.player.overview.wins.value}</p>
              <p>Goals: {data.player.overview.goals.value}</p>
              <p>Saves: {data.player.overview.saves.value}</p>
              <p>Assists: {data.player.overview.assists.value}</p>
              <p>Shots: {data.player.overview.shots.value}</p>
            </div>
            <div className="col-md-3"></div>
          </div>
        </div>
      </Fragment>
    </div>
  );
};

export default Player;
