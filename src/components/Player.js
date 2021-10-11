import React, { Fragment, useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import Segments from "./Segments";
import Overview from "./Overview";
import PlayerHeader from "./PlayerHeader";
import { Link } from "react-router-dom";

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
      }
    }
  }
`;

const Player = ({ playerId }) => {
  const [season, setSeason] = useState(17);
  const { loading, error, data } = useQuery(PLAYER_QUERY, {
    variables: { id: playerId },
    fetchPolicy: "no-cache"
  });
  useEffect(() => {
    if (!data) {
      return;
    }
    if (!data.player.availableSegments.length) {
      return;
    }
    setSeason(data.player.availableSegments.length);
  }, [data]);
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
    <Fragment>
      <div className="card card-body mb-3">
        <div className="player-header card-header">
          <PlayerHeader data={data.player} />
          <div className="player-header--content">
            <div className="dropdown player-header__name">
              <h3 className="player-header__name">Season</h3>
              <select
                // value={season}
                onChange={(e) => setSeason(e.target.value)}
                defaultValue={data.player.availableSegments.length}
                className="season-select"
              >
                {data.player.availableSegments.map((segment, index) => {
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
          <div className="player-header--content">
            <button className="button">
              <Link to={{ pathname: `/${playerId}`, state: data.player }}>
                RECENT MATCHES
              </Link>
            </button>
          </div>
        </div>
        <div className="player-stats">
          <Overview
            playerId={playerId}
            season={season}
            overview={data.player.overview}
          />
          <Segments playerId={playerId} season={season} />
        </div>
      </div>
    </Fragment>
  );
};

export default Player;
