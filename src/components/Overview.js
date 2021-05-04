import React from "react";

export default function Overview({ data }) {
  return (
    <>
      <div className="playlist-stats--overview">
        <h3 className="sub-title">Overview</h3>
        <table className="stats__table">
          {Object.keys(data)
            .filter((stat) => {
              if (stat === "__typename" || stat === "seasonRewardLevel") {
                return false;
              }
              return true;
            })
            .map((stat) => {
              return (
                <tbody key={data[stat].value}>
                  <tr>
                    <td>{data[stat].displayName.toUpperCase()}</td>
                    <td>{parseInt(data[stat].value)}</td>
                  </tr>
                </tbody>
              );
            })}
        </table>
      </div>
    </>
  );
}
