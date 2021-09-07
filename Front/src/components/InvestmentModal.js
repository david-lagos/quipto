import React, { PureComponent } from "react";
import "./InvestmentModal.css";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Customized,
} from "recharts";

const InvestmentModal = ({
  isInvestmentOpen,
  closeInvestmentModal,
  title,
  children,
  firstToken,
  secondToken,
  initialStake,
  currentStake,
  days,
  yieldInvestment,
  chartData,
}) => {
  const handleModalDialogClick = (e) => {
    e.stopPropagation();
  };

  // const data = [
  //   {
  //     day: 1,
  //     pv: 2400,
  //     amt: 2400,
  //   },
  //   {
  //     day: 2,
  //     pv: 1398,
  //     amt: 2210,
  //   },
  //   {
  //     day: 3,
  //     pv: 9800,
  //     amt: 2290,
  //   },
  //   {
  //     day: 4,
  //     pv: 3908,
  //     amt: 2000,
  //   },
  //   {
  //     day: 5,
  //     pv: 4800,
  //     amt: 2181,
  //   },
  //   {
  //     day: 6,
  //     pv: 3800,
  //     amt: 2500,
  //   },
  //   {
  //     day: 7,
  //     pv: 4300,
  //     amt: 2100,
  //   },
  //   {
  //     day: 8,
  //     pv: 2400,
  //     amt: 2400,
  //   },
  //   {
  //     day: 9,
  //     pv: 1398,
  //     amt: 2210,
  //   },
  //   {
  //     day: 10,
  //     pv: 9800,
  //     amt: 2290,
  //   },
  // ];

  class CustomizedAxisTick extends PureComponent {
    render() {
      const { x, y, stroke, payload } = this.props;
  
      return (
        <g transform={`translate(${x},${y})`}>
          <text x={40} y={50} dy={16} textAnchor="end" fill="#666" transform="rotate(0)">
            {payload.value}
          </text>
        </g>
      );
    }
  }

  return (
    <div
      className={`modal ${isInvestmentOpen && "modal-open"}`}
      onClick={closeInvestmentModal}
    >
      <div
        className="modal__dialog_investment"
        onClick={handleModalDialogClick}
      >
        <div className="title-close-container">
          <div className="title">
            <h1 className="modal-investment-title">
              {" "}
              <b>Uniswap </b> {firstToken} / {secondToken}
            </h1>
          </div>
          <div className="titleCloseBtn">
            <button onClick={closeInvestmentModal}>X</button>
          </div>
        </div>

        <div className="contentInvest">
          <table id="tableInvestment">
            <tbody>
              <tr>
                <th>Initial Stake</th>
                <th>Current Stake</th>
              </tr>
              <tr>
                <td>{initialStake}</td>
                <td>{currentStake}</td>
              </tr>
              <tr>
                <th>Days Active</th>
                <th>Fees Earned</th>
              </tr>
              <tr>
                <td>{days}</td>
                <td>{yieldInvestment}</td>
              </tr>
            </tbody>
          </table>
          <div className="graph">
            <AreaChart
              width={550}
              height={250}
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="timestamp" height={40} tick={<CustomizedAxisTick />}/>
              <YAxis dataKey="feesUSD" />
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <Tooltip />
              <Area
                type="monotone"
                dataKey="feesUSD"
                stroke="#82ca9d"
                fillOpacity={1}
                fill="url(#colorPv)"
              />
            </AreaChart>
          </div>
          {/* <button>Close position</button> */}
        </div>
        {children}
      </div>
    </div>
  );
};

export default InvestmentModal;