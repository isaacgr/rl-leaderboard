import React from "react";

export default function Overview({ playerId, season, overview }) {
  return (
    <>
      <div className="playlist-stats--overview">
        <h3 className="sub-title">Overview</h3>
        <table className="stats__table">
          {Object.keys(overview)
            .filter((stat) => {
              if (stat === "__typename" || stat === "seasonRewardLevel") {
                return false;
              }
              return true;
            })
            .map((stat) => {
              return (
                <tbody key={overview[stat].value}>
                  <tr>
                    <td>{overview[stat].displayName.toUpperCase()}</td>
                    <td>{parseInt(overview[stat].value)}</td>
                  </tr>
                </tbody>
              );
            })}
        </table>
      </div>
    </>
  );
}
