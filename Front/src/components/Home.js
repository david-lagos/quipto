import React, { useEffect, useState } from "react";
import axios from "axios";
import Deals from "./deals";
import Investments from "./Investments";
import MainChart from "./mainChart";
import useStateWithPromise from "../hooks/useStateWithPromise";
import ApexCharts from "apexcharts";
import AccountBoxes from "./AccountBoxes";

function Home(props) {
  let today = new Date();
  let aWeekAgo = new Date();
  aWeekAgo.setDate(today.getDate() - 7);
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  var firstOfYear = new Date(today.getFullYear(), 1, 1);
  var lastOfYear = new Date(today.getFullYear(), 12, 31);
  const { isLoggedIn, portfolio } = props;

  const [deals, setDeals] = useState([]);

  const arr = [
    {
      value: "500",
      growth: "2%",
    },
    {
      value: "1000",
      growth: "4%",
    },
    {
      value: "2000",
      growth: "8%",
    },
    {
      value: "4000",
      growth: "16%",
    },
  ];

  const [value, setValue] = useState(arr[0].value);
  const [growth, setGrowth] = useState(arr[0].growth);

  useEffect(() => {
    axios
      .get("http://localhost:9000/topDealsAPI")
      .then((res) => {
        setDeals(res.data);
      })
      .catch((error) => console.log(error));
  }, []);

  // const invest = [
  //   {
  //     firstToken:'USDC',
  //     secondToken: 'WETH',
  //     initialStake: '$75k',
  //     yield: '25%'
  //   },
  //   {
  //     firstToken:'USDC',
  //     secondToken: 'WETH',
  //     initialStake: '$75k',
  //     yield: '25%'
  //   },{
  //     firstToken:'USDC',
  //     secondToken: 'WETH',
  //     initialStake: '$75k',
  //     yield: '25%'
  //   },{
  //     firstToken:'USDC',
  //     secondToken: 'WETH',
  //     initialStake: '$75k',
  //     yield: '25%'
  //   },{
  //     firstToken:'USDC',
  //     secondToken: 'WETH',
  //     initialStake: '$75k',
  //     yield: '25%'
  //   }
  // ]

  const filteredDeals = deals.filter((deals) => deals.token0);

  // Functions

  const [title, setTitle] = useState("7 Days");

  const [selection, setSelection] = useStateWithPromise();

  const updateData = (option) => {
    switch (option) {
      case "one_week":
        ApexCharts.exec(
          "area-datetime",
          "zoomX",
          new Date(aWeekAgo).getTime(),
          new Date().getTime()
        );
        setTitle("7 Days");
        break;
      case "one_month":
        ApexCharts.exec(
          "area-datetime",
          "zoomX",
          new Date(firstDay).getTime(),
          new Date(lastDay).getTime()
        );
        setTitle("1 Month");
        break;
      case "one_year":
        ApexCharts.exec(
          "area-datetime",
          "zoomX",
          new Date(firstOfYear).getTime(),
          new Date(lastOfYear).getTime()
        );
        setTitle("One Year");
        break;
      case "all":
        ApexCharts.exec(
          "area-datetime",
          "zoomX",
          new Date("18 May 2020").getTime(),
          new Date().getTime()
        );
        setTitle("All Times");
        break;
      default:
    }
  };

  return (
    <div className="body-container">
      {/*<!-- SLIDER-->*/}

      {/*<!-- SLIDER ENDS -->*/}

      {/*<!-- MY ACCOUNT -->*/}
      <div className="my-account-container">
        <div className="title-my-account">
          <h1>My Account</h1>
        </div>
        <div className="filter-my-account">
          <div className="dropdown" id="home_filter">
            <button className="dropbtn">
              {title}{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-caret-down-fill"
                viewBox="0 0 16 16"
              >
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
              </svg>
            </button>
            <div className="dropdown-content">
              <button
                id="one_week"
                onClick={() => {
                  setSelection("one_week").then((option) => {
                    updateData(option);
                    setValue(arr[0].value);
                    setGrowth(arr[0].growth);
                  });
                }}
                //className={selection === "one_week" ? "active" : ""}
              >
                1W
              </button>
              &nbsp;
              <button
                id="one_month"
                onClick={() => {
                  setSelection("one_month").then((option) => {
                    updateData(option);
                    setValue(arr[1].value);
                    setGrowth(arr[1].growth);
                  });
                }}
                className={selection === "one_month" ? "active" : ""}
              >
                1M
              </button>
              &nbsp;
              <button
                id="one_year"
                onClick={() => {
                  setSelection("one_year").then((option) => {
                    updateData(option);
                    setValue(arr[2].value);
                    setGrowth(arr[2].growth);
                  });
                }}
                className={selection === "one_year" ? "active" : ""}
              >
                1Y
              </button>
              &nbsp;
              <button
                id="all"
                onClick={() => {
                  setSelection("all").then((option) => {
                    updateData(option);
                    setValue(arr[3].value);
                    setGrowth(arr[3].growth);
                  });
                }}
                className={selection === "all" ? "active" : ""}
              >
                ALL
              </button>
            </div>
          </div>
        </div>
        <div className="growth-info">
          {isLoggedIn ? (
            <div className="boxes-container">
                <AccountBoxes
                  value={"$1.3T"}
                  title={"Total Market Crypto Cap"}
                />
              <AccountBoxes value={growth} title={"Portfolio Growth"} /> 
             <AccountBoxes value={value} title={"Portfolio Value"} />
            </div>
          ) : (
           
              <div className="boxes-container">
                <div className="">
                  <AccountBoxes
                    value={"$1.3T"}
                    title={"Total Market Crypto Cap"}
                  />
                </div>
              </div>
          )}
        </div>
        <div className="graphs-growth">
          <div className="graph-1">
            <h3>Portfolio Growth</h3>
            <MainChart portfolio={portfolio} selection={selection} />
          </div>
        </div>
      </div>
      {/*<!-- MY ACCOUNT ENDS -->*/}

      <div className="investment-topDeals-container">
        {/*<!-- MY INVESTMENTS START -->*/}
        <div className="my-investments-container">
          <div className="title-my-investments">
            <h1>My Investments</h1>
          </div>
          <div className="text-investments">
            <h6>
              Keep track of liquity pools on which you have staked your
              cryptocurrency
            </h6>
          </div>
          <div className="investments">
            {portfolio.map((investment) => {
              return (
                <Investments
                  firstToken={investment.token0}
                  secondToken={investment.token1}
                  initialStake={"$" + investment.initial.toFixed(2)}
                  currentStake={"$" + investment.current.toFixed(2)}
                  days={investment.days}
                  yieldInvestment={"$" + investment.feesEarned.toPrecision(3)}
                  chartData={investment.data}
                />
              );
            })}
          </div>
        </div>
        {/*<!-- MY INVESTMENTS ENDS -->*/}

        {/*<!-- TOP DEALS -->*/}
        <div className="top-deals-container">
          <div className="title-top-deals">
            <h1>Top Deals</h1>
          </div>
          <div className="text-top-deals">
            <h6>
              Keep track of liquity pools on which you have staked your
              cryptocurrency
            </h6>
          </div>

          <div className="top-deals">
            {filteredDeals.map((deals) => {
              return (
                <Deals
                  firstTokenSymbol={deals.token0.symbol}
                  firstTokenId={deals.token0.id}
                  secondTokenSymbol={deals.token1.symbol}
                  TVL={deals.liquidity}
                  yieldTotal={deals.yieldPer}
                  last30={deals.last30}
                  isLoggedIn={isLoggedIn}
                />
              );
            })}
          </div>
        </div>
        {/*<!-- TOP DEALS  ENDS-->*/}
      </div>
    </div>
  );
}

export default Home;
