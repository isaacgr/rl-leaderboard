import React, { Fragment } from "react";
import { useQuery, gql } from "@apollo/client";

const PLAYER_QUERY = gql`
  query PlayerQuery($id: String!) {
    player(id: $id) {
      platformInfo {
        platformUserHandle
        avatarUrl
      }
      segments {
        type
        metadata {
          name
        }
        stats {
          tier {
            metadata {
              name
            }
          }
          division {
            metadata {
              name
            }
          }
          matchesPlayed {
            value
          }
          winStreak {
            value
          }
          rating {
            value
          }
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

const validPlaylists = [
  "Ranked Duel 1v1",
  "Ranked Doubles 2v2",
  "Ranked Standard 3v3"
];

const Player = ({ playerId }) => {
  const { loading, error, data, refetch } = useQuery(PLAYER_QUERY, {
    variables: { id: playerId },
    fetchPolicy: "no-cache"
  });
  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log(error);
    return <p>Error :(</p>;
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
                style={{ width: 50, display: "block" }}
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
                style={{ width: 50, display: "block" }}
              />
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
                      <tr>
                        <td>
                          {data.player.overview[stat].displayName.toUpperCase()}
                        </td>
                        <td>{data.player.overview[stat].value}</td>
                      </tr>
                    );
                  })}
              </table>
            </div>
            {data.player.segments
              .filter((playlist) => {
                const name = playlist.metadata.name;
                if (validPlaylists.includes(name)) {
                  return true;
                }
              })
              .map((playlist) => {
                return (
                  <div className="playlist-stats">
                    <h3 className="sub-title">{playlist.metadata.name}</h3>
                    <table className="stats__table">
                      {Object.keys(playlist.stats)
                        .filter((stat) => {
                          if (stat === "__typename") {
                            return false;
                          }
                          return true;
                        })
                        .map((stat) => {
                          return (
                            <tr>
                              <td>{stat.toUpperCase()}</td>
                              <td>
                                {playlist.stats[stat].metadata
                                  ? playlist.stats[stat].metadata.name
                                  : playlist.stats[stat].value}
                              </td>
                            </tr>
                          );
                        })}
                    </table>
                  </div>
                );
              })}
          </div>
        </div>
      </Fragment>
    </div>
  );
};

export default Player;
