import React from "react";

type Props = {
  topFive:
    | {
        hostName: string;
        count: number;
      }[]
    | undefined;
};

const TopFivePingSites: React.FC<Props> = ({ topFive }) => {
  if (topFive === undefined) {
    return <></>;
  }
  return (
    <>
      <h1>Pings</h1>
      <table>
        <thead>
          <tr>
            <th>Top ping sites</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {topFive.map(
            (row, index) =>
              row && (
                <tr key={index}>
                  <td>{row.hostName}</td>
                  <td>{row.count}</td>
                </tr>
              )
          )}
        </tbody>
      </table>{" "}
    </>
  );
};

export default TopFivePingSites;
