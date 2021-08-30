import React from "react";
import "./Estimates.css";

export default function Estimates(props) {
  const { dailyIncome, monthlyIncome } = props;

  return (
    <div>
      <table className="estimated">
        <td>
          <span className="estimated-text">Estimated Yield Income</span>
        </td>
        <td>
          <tr className="yield">
            {dailyIncome} <b>USD Daily</b>
          </tr>
          <tr className="yield">
            {monthlyIncome} <b>USD Monthly</b>
          </tr>
        </td>
      </table>
    </div>
  );
}
