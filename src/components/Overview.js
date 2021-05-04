import React from "react";
import { useQuery, gql } from "@apollo/client";

const OVERVIEW_QUERY = gql`
  query OverviewQuery($id: String!) {
    player(id: $id) {
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
      }
    }
  }
`;

export default function Overview({ playerId }) {
  const { loading, error, data } = useQuery(OVERVIEW_QUERY, {
    variables: { id: playerId }
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
    <>
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
                      {data.player.overview[stat].displayName.toUpperCase()}
                    </td>
                    <td>{parseInt(data.player.overview[stat].value)}</td>
                  </tr>
                </tbody>
              );
            })}
        </table>
      </div>
    </>
  );
}
