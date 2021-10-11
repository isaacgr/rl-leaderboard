import React, { Fragment } from "react";
import { useQuery, gql } from "@apollo/client";
import moment from "moment";
import PlayerHeader from "./PlayerHeader";

const SESSIONS_QUERY = gql`
  query SessionQuery($id: String!) {
    sessions(id: $id) {
      metadata {
        startDate {
          value
        }
        endDate {
          value
        }
      }
      matches {
        metadata {
          playlist
          result
          dateCollected
        }
        stats {
          goals {
            value
            displayName
          }
          assists {
            value
            displayName
          }
          saves {
            value
            displayName
          }
          shots {
            value
            displayName
          }
          matchesPlayed {
            value
            displayName
          }
          wins {
            value
            displayName
          }
        }
      }
    }
  }
`;

const Sessions = (props) => {
  const { loading, error, data } = useQuery(SESSIONS_QUERY, {
    variables: { id: props.match.params.playerId },
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
    <div className="sessions-card card card-body mb-3">
      <div className="player-header card-header">
        <PlayerHeader data={props.location.state} />
      </div>
      {data.sessions.map((session) => {
        return (
          <div key={Math.random().toString()} className="playlist-stats">
            <h3 key={Math.random().toString()} className="sub-title">
              SESSION
            </h3>
            <h4 key={Math.random().toString()} className="note">
              {moment(session.metadata.endDate.value).format("LLL")}
            </h4>
            <table key={Math.random().toString()} className="stats__table">
              {session.matches
                .filter(
                  (match) =>
                    match.stats.wins.value || match.stats.matchesPlayed.value
                )
                .map((match) => {
                  return (
                    <Fragment key={Math.random().toString()}>
                      <tbody key={Math.random().toString()}>
                        <tr>
                          <th>{match.metadata.playlist}</th>
                        </tr>
                      </tbody>
                      {Object.keys(match.stats)
                        .filter((stat) => {
                          if (stat === "__typename") {
                            return false;
                          }
                          return true;
                        })
                        .map((stat) => {
                          return (
                            <tbody key={Math.random().toString()}>
                              <tr>
                                <td>
                                  {match.stats[stat].displayName.toUpperCase()}
                                </td>
                                <td>{match.stats[stat].value}</td>
                              </tr>
                            </tbody>
                          );
                        })}
                    </Fragment>
                  );
                })}
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default Sessions;
