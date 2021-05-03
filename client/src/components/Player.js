import React, { Fragment, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import Segments from "./Segments";

const PLAYER_QUERY = gql`
  query PlayerQuery($id: String!) {
    player(id: $id) {
      platformInfo {
        platformUserHandle
        avatarUrl
      }
      availableSegments {
        metadata {
          name
        }
        attributes {
          season
        }
      }
      overview {
        wins {
          value
          displayName
        }
        goals {
          value
          displayName
        }
        saves {
          value
          displayName
        }
        assists {
          value
          displayName
        }
        mVPs {
          value
          displayName
        }
        shots {
          value
          displayName
        }
        goalShotRatio {
          value
          displayName
        }
        seasonRewardLevel {
          metadata {
            rankName
            iconUrl
          }
        }
      }
    }
  }
`;

const Player = ({ playerId }) => {
  const [season, setSeason] = useState(17);
  console.log(season);
  const { loading, error, data, refetch } = useQuery(PLAYER_QUERY, {
    variables: { id: playerId },
    fetchPolicy: "no-cache"
  });
  if (loading) return <h2 className="sub-title">Loading...</h2>;
  if (error) {
    console.log(error);
    return (
      <h2 className="sub-title" id="error">{`Error: ${error.message}`}</h2>
    );
  }
  if (data.length === 0) {
    return (
      <h2 className="sub-title" id="error">
        No data
      </h2>
    );
  }
  return (
    <div>
      <Fragment>
        <div className="card card-body mb-3">
          <div className="player-header card-header">
            <div className="player-header--content">
              <img
                alt="img"
                src={data.player.platformInfo.avatarUrl}
                style={{ width: 100, display: "block" }}
              />
              <h4 className="player-header__name">
                {data.player.platformInfo.platformUserHandle}
              </h4>
            </div>
            <div className="player-header--content">
              <h3 className="player-header__name">
                {data.player.overview.seasonRewardLevel.metadata.rankName}
              </h3>
              <img
                alt="img"
                src={data.player.overview.seasonRewardLevel.metadata.iconUrl}
                style={{ width: 100, display: "block" }}
              />
            </div>
            <div className="player-header--content">
              <div className="dropdown">
                <h3 className="sub-title">Pattern Selection</h3>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                >
                  {data.player.availableSegments.map((segment) => {
                    return (
                      <option
                        key={segment.attributes.season}
                        value={segment.attributes.season}
                      >
                        {segment.metadata.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="player-stats">
            <div className="playlist-stats--overview">
              <h3 className="sub-title">Overview</h3>
              <table className="stats__table">
                {Object.keys(data.player.overview)
                  .filter((stat) => {
                    if (stat === "__typename" || stat === "seasonRewardLevel") {
                      return false;
                    }
                    return true;
                  })
                  .map((stat) => {
                    return (
                      <tbody key={data.player.overview[stat].value}>
                        <tr>
                          <td>
                            {data.player.overview[
                              stat
                            ].displayName.toUpperCase()}
                          </td>
                          <td>{data.player.overview[stat].value}</td>
                        </tr>
                      </tbody>
                    );
                  })}
              </table>
            </div>
            <Segments playerId={playerId} season={season} />
          </div>
        </div>
      </Fragment>
    </div>
  );
};

export default Player;
