import React, { useEffect, useState } from "react";
import axios from "axios";
import Deals from "./deals";
import Investments from "./Investments";
import MainChart from './mainChart';

function Home(props) {

  const {
    isLoggedIn,
    portfolio
  } = props

  const [deals, setDeals] = useState([]);

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

  const filteredDeals = deals.filter(deals => deals.token0);

  // Functions
  let selection;
  const changeSelection = (event) => {
    selection = event.target.options.selectedIndex
  }
  
  return (
    <div class="body-container">
      {/*<!-- SLIDER-->*/}

      {/*<!-- SLIDER ENDS -->*/}

      {/*<!-- MY ACCOUNT -->*/}
      <div class="my-account-container">
        <div class="title-my-account">
          <h1>My Account</h1>
        </div>
        <div class="filter-my-account">
          <select name="home_filter" id="home_filter" onChange={(e) => changeSelection(e)}>
            <option value="">All times</option>
            <option value="" selected="selected">
              7 Days
            </option>
            <option value="">This Month</option>
            <option value="">This Year</option>
          </select>
        </div>
        <div class="growth-info">
          <h1>$1.3T</h1>
          <p>Total Crypto Market Cap</p>
          <h1>+17%</h1>
          <p>Portfolio Growth</p>
          <h1>+$18K</h1>
          <p>Portfolio Value</p>
        </div>
        <div class="graphs-growth">
          <div class="graph-1">
            <h3>Portfolio Growth</h3>
            <MainChart 
              portfolio={portfolio}
              option={selection}
            />
          </div>
        </div>
      </div>
      {/*<!-- MY ACCOUNT ENDS -->*/}

      <div class="investment-topDeals-container">
        {/*<!-- MY INVESTMENTS START -->*/}
        <div class="my-investments-container">
          <div class="title-my-investments">
            <h1>My Investments</h1>
          </div>
          <div class="text-investments">
            <h6>
              Keep track of liquity pools on which you have staked your
              cryptocurrency
            </h6>
          </div>
          <div class="investments">
            {portfolio.map((investment) => {
              return(
                <Investments
                  firstToken={investment.token0}
                  secondToken={investment.token1}
                  initialStake={'$' + investment.initial.toFixed(2)}
                  currentStake={'$' + investment.current.toFixed(2)}
                  days={investment.days}
                  yieldInvestment={'$' + investment.feesEarned.toPrecision(3)}
                  chartData={investment.data}
                />
              );
            })}
          </div>
        </div>
        {/*<!-- MY INVESTMENTS ENDS -->*/}

        {/*<!-- TOP DEALS -->*/}
        <div class="top-deals-container">
          <div class="title-top-deals">
            <h1>Top Deals</h1>
          </div>
          <div class="text-top-deals">
            <h6>
              Keep track of liquity pools on which you have staked your
              cryptocurrency
            </h6>
          </div>

          <div class="top-deals">
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
