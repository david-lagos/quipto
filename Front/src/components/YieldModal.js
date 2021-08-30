import React from "react";
import "./YieldModal.css";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const YieldModal = ({
  isOpenYield,
  closeModalYield,
  title,
  children,
  yieldTotal,
  last30
}) => {
  const handleModalDialogClick = (e) => {
    e.stopPropagation();
  };

  // const data = [
  //   {
  //     yield: yieldTotal,
  //     day: 1,
  //     pv: 2400,
  //     amt: 2400,
  //   },
  //   {
  //     yield: yieldTotal,
  //     day: 2,
  //     pv: 1398,
  //     amt: 2210,
  //   },
  //   {
  //     yield: yieldTotal,
  //     day: 3,
  //     pv: 9800,
  //     amt: 2290,
  //   },
  //   {
  //     yield: yieldTotal,
  //     day: 4,
  //     pv: 3908,
  //     amt: 2000,
  //   },
  //   {
  //     yield: yieldTotal,
  //     day: 5,
  //     pv: 4800,
  //     amt: 2181,
  //   },
  //   {
  //     yield: yieldTotal,
  //     day: 6,
  //     pv: 3800,
  //     amt: 2500,
  //   },
  //   {
  //     yield: yieldTotal,
  //     day: 7,
  //     pv: 4300,
  //     amt: 2100,
  //   },
  //   {
  //     yield: yieldTotal,
  //     day: 8,
  //     pv: 2400,
  //     amt: 2400,
  //   },
  //   {
  //     yield: yieldTotal,
  //     day: 9,
  //     pv: 1398,
  //     amt: 2210,
  //   },
  //   {
  //     yield: yieldTotal,
  //     day: 10,
  //     pv: 9800,
  //     amt: 2290,
  //   }
  // ];

  return (
    <div
      className={`modal ${isOpenYield && "modal-open"}`}
      onClick={closeModalYield}
    >
      <div className="modal__dialog_yield" onClick={handleModalDialogClick}>
        <div className="title-close-container">
          <div className="title">
            <h1 className="modal-title">{title}</h1>
          </div>
          <div className="titleCloseBtn">
            <button onClick={closeModalYield}>X</button>
          </div>
        </div>

        <div className="content-container">
          <AreaChart
            width={550}
            height={250}
            data={last30}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="timestamp" />
            <YAxis  dataKey="yield"/>
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <Tooltip />
            <Area
              type="monotone"
              dataKey="yield"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorPv)"
            />
          </AreaChart>
          {children}
        </div>
      </div>
    </div>
  );
};

export default YieldModal;
