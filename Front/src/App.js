import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './components/Home'
import Slider from './components/Slider'
import GetPoolData from './components/getPoolData'

function App() { 
  const provider = useRef(window.ethereum);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [address, setAddress] = useState('Connect Wallet');
  const [portfolio, setPortfolio] = useState([]);
  const [mainChartData, setMainChartData] = useState([])

  useEffect(() => {
  setTimeout(() => {
    if(provider.current.selectedAddress !== null) {
      console.log('Hello, you are logged in');
      setIsLoggedIn(true);
      setAddress(provider.current.selectedAddress);
      getInvestments(provider.current.selectedAddress).then(myData => {
        setPortfolio(myData.portfolio);
        setMainChartData(myData.chartData);
      });
    } else {
      console.log('You are not logged in');
      setPortfolio([]);
      setMainChartData([]);
    }
  }, 500);

  provider.current.on('accountsChanged', (accounts) => {
    if(!accounts.length){
      setAddress('Connect Wallet');
      setIsLoggedIn(false);
      setPortfolio([]);
      setMainChartData([]);
    } else {
      setAddress(provider.current.selectedAddress);
      setIsLoggedIn(true);
      getInvestments(provider.current.selectedAddress).then(myData => {
          setPortfolio(myData.portfolio);
          setMainChartData(myData.chartData);
    });
    }
  });
  }, [])


  return (
    <div className="App">
      <Header address={address} onClick={() => connect()}></Header>
      <Slider/>
      <Home portfolio={portfolio} mainChartData={mainChartData} isLoggedIn={isLoggedIn}/>
      <Footer></Footer>
    </div>
  );
  
}

// Helper Functions

const connect = async() => {
  try {
      // find provider
      if(window.ethereum) {
          // send connection request to wallet
          await window.ethereum.request({ method: 'eth_requestAccounts' });
      } else {
          // handler in case a web3 provider is not found
          alert('You require a web3 provider');
      }
  } catch(error) {
      // handler in case user rejects the connection request
      alert('You have rejected the request');
  }
}

const getInvestments = async(address) => {
  
  const positions = await GetPoolData.getPositions('0x00099edfc1f6946a05751ac4648926bf9bae9131');
  
  const arrLiquidity = [];
  const arrDeals = [];
  
  await Promise.all(positions.map(async(pos) => {
    
    const arrFees = [];

    // Get my pair id
    const myPairId = pos.id.split('-')[0];
        
    // Get my snaps
    const mySnapsQuery = await GetPoolData.getSnapshots(pos.id, myPairId);
    const mySnaps = mySnapsQuery.liquidityPositionSnapshots;
    
    // Get my token ids
    const myPair = mySnapsQuery.pairs;
    const myToken0Id = myPair[0].token0.id;
    const myToken1Id = myPair[0].token1.id;

    // Is the pos active?
    const isPosActive = mySnaps[0].liquidityTokenBalance !== '0' ? true : false;
    isPosActive ? console.log('This position is active') : console.log('This position is inactive');

    if(!isPosActive){
        return
    }

    // Isolate my first snap
    const myFirstSnap = mySnaps[mySnaps.length - 1];
    const myFirstTimestamp = myFirstSnap.timestamp;

    // Get my share on day 1
    const myShareDay1 = parseFloat(myFirstSnap.liquidityTokenBalance)/parseFloat(myFirstSnap.liquidityTokenTotalSupply);
    
    const myStake0Day1 = myShareDay1 * parseFloat(myFirstSnap.reserve0);
    const myStake1Day1 = myShareDay1 * parseFloat(myFirstSnap.reserve1);

    //console.log('initial stake token0: ', myStake0Day1);
    //console.log('initial stake token1: ', myStake1Day1);
    
    // Midnight next day
    let date = new Date(0);
    date.setUTCSeconds(myFirstTimestamp);
    date.setUTCHours(0,0,0);
    date.setDate(date.getDate() + 1);
    const midnightNextDay = Math.floor(date / 1000);

    // Fetch historical data
    const myHistoricalData = await GetPoolData.getHistoricalData(myPairId, myFirstTimestamp, midnightNextDay, myToken0Id, myToken1Id);

    // Reduce swaps on day stake was made
    const sum = myHistoricalData.swaps.reduce((a,b) => {
      return {
          amountUSD: parseFloat(a.amountUSD) + parseFloat(b.amountUSD),
          amount0In: parseFloat(a.amount0In) + parseFloat(b.amount0In),
          amount1In: parseFloat(a.amount1In) + parseFloat(b.amount1In)
      }
    });

    // Set timestamp to day 1
    date.setDate(date.getDate() - 1);
    const stampStakeDay = Math.floor(date / 1000);

    // Build historical data

    let index = mySnaps.length - 1;

    const stakeDay = {
        timestamp: stampStakeDay,
        feesUSD: sum.amountUSD * 0.003 * myShareDay1,
        fees0: sum.amount0In * 0.003 * myShareDay1 * 2,
        fees1: sum.amount1In * 0.003 * myShareDay1 * 2,
        liquidity: (mySnaps[index].liquidityTokenBalance / mySnaps[index].liquidityTokenTotalSupply) * parseFloat(mySnaps[index].reserveUSD)
    }


    // Get my array of timestamps
    const myArrayStamps = [];
    mySnaps.map(snap => {
        myArrayStamps.push(snap.timestamp)
    });

    // console.log(myArrayStamps.length);

    // This will create a library with daily price data
    const myToken0Symbol = myPair[0].token0.symbol
    const [myPriceLibrary0, myPriceLibrary1] = createLibrary(myHistoricalData.tokenDayDatas, myToken0Symbol);

    myHistoricalData.pairDayDatas.map(pairDatum => {
        
        if(( pairDatum.date > myArrayStamps[index - 1] ) && ( index > 0 )) {
            // console.log(mySnaps[index]);
            // console.log(pairDatum.date, myArrayStamps[index]);
            index--;
            // console.log(mySnaps[index]);
        }

        const shareDay = mySnaps[index].liquidityTokenBalance / pairDatum.totalSupply;
        // console.log(mySnaps[index].timestamp, pairDatum.date);

        const liquidityDay = shareDay * pairDatum.reserveUSD;

        const obj = {
            timestamp: pairDatum.date,
            feesUSD: parseFloat(pairDatum.dailyVolumeUSD) * 0.003 * shareDay,
            fees0: parseFloat(pairDatum.dailyVolumeToken0) * 0.003 * shareDay,
            fees1: parseFloat(pairDatum.dailyVolumeToken1) * 0.003 * shareDay,
            liquidity: liquidityDay
        }

        if(mySnaps[index].liquidityTokenBalance === '0'){
            arrFees[arrFees.length - 1].liquidity = 0;
        }
        
        arrLiquidity.push(obj);
        arrFees.push(obj);
    })

    arrLiquidity.push(stakeDay);
    arrFees.push(stakeDay);
    
    arrFees.sort((a, b) => {
        return a.timestamp - b.timestamp
    });

    //console.log(arrFees);

    const cumulativeSum = ((sum, sum0, sum1) => pos => {
        return {
            timestamp: pos.timestamp,
            feesUSD: sum += pos.feesUSD,
            fees0: sum0 += pos.fees0,
            fees1: sum1 += pos.fees1,
            liquidity: pos.liquidity
        };
    })(0, 0, 0);

    const arrApex = [];
    const cumArray = arrFees.map(cumulativeSum);
    let firstTime = true;
    cumArray.map(pos => {
        const price0 = myPriceLibrary0[pos.timestamp];
        const price1 = myPriceLibrary1[pos.timestamp];
        const helperArr = [];
        helperArr.push(pos.timestamp * 1000);
        helperArr.push(pos.liquidity);
        helperArr.push(pos.feesUSD);
        if(pos.liquidity === 0 && !firstTime){
            helperArr.push(arrApex[arrApex.length-1][3]);
        } else if (pos.liquidity === 0 && firstTime) {
            helperArr.push(((pos.fees0 * parseFloat(price0)) + (pos.fees1 * parseFloat(price1)))/2);
            firstTime = false;
        } else {
            helperArr.push(((pos.fees0 * parseFloat(price0)) + (pos.fees1 * parseFloat(price1)))/2);
        }
        arrApex.push(helperArr);
    });

    // This piece takes care of converting the accumulated array into USD
    // const arrApex2 = [];
    // arrApex.map(pos => {
    //     const helperArr = [];
    //     console.log(pos[5]);
    //     const feesUSD2 = (pos[2] * price0) + (pos[3] * price1);
    //     helperArr.push(pos[0]);
    //     helperArr.push(pos[1]);
    //     helperArr.push(feesUSD2);
    //     helperArr.push(pos[4]);
    // });

    // Organize the slices
    let my7DaySlice = [];
    let my30DaySlice = [];
    if(arrApex.length < 7){
        my7DaySlice = arrApex;
        my30DaySlice = arrApex;
    } else if (arrApex.length < 30) {
        my7DaySlice = arrApex.slice(arrApex.length - 7, arrApex.length);
        my30DaySlice = arrApex;
    } else {
        my7DaySlice = arrApex.slice(arrApex.length - 7, arrApex.length);
        my30DaySlice = arrApex.slice(arrApex.length - 30, arrApex.length);
    }

    const my7DayData = [];
    const my30DayData = [];

    if(my7DaySlice.length < 7){
        my7DayData.push(0);
        my7DayData.push(my7DaySlice[my7DaySlice.length - 1][1]);
    } else {
        my7DayData.push(my7DaySlice[0][1]);
        my7DayData.push(my7DaySlice[my7DaySlice.length - 1][1]);
    }

    if(my30DaySlice.length < 30){
        my30DayData.push(0);
        my30DayData.push(my30DaySlice[my30DaySlice.length - 1][1]);
    } else {
        my30DayData.push(my30DaySlice[0][1]);
        my30DayData.push(my30DaySlice[my30DaySlice.length - 1][1]);
    }

    // console.log(my7DaySlice.length, my30DaySlice.length);
    // console.log(my7DayData);
    // console.log(my30DayData);
    
    //Build deal object
    const dealObj = {
        token0: myPair[0].token0.symbol,
        token1: myPair[0].token1.symbol,
        initial: (myStake0Day1 * myFirstSnap.token0PriceUSD) + (myStake1Day1 * myFirstSnap.token1PriceUSD),
        current: my7DayData[1],
        feesEarned: arrApex[arrApex.length-1][3],
        days: arrFees.length - 1,
        data: cumArray,
        apexData: {
            data: arrApex
        },
        my7DayData,
        my30DayData
    }

    arrDeals.push(dealObj);
    
  }));

  const myLiquidityHistory = {};
    arrLiquidity.map(pos => {
        if(pos.timestamp in myLiquidityHistory){
            myLiquidityHistory[pos.timestamp] += pos.liquidity;
        } else {
            myLiquidityHistory[pos.timestamp] = pos.liquidity
        }
    });

    const myLiquidityArray = [];
    Object.keys(myLiquidityHistory).map(date => {
        const helperArr = [];
        helperArr.push(parseFloat(date) * 1000);
        helperArr.push(myLiquidityHistory[date].toFixed(2));
        myLiquidityArray.push(helperArr);
    });

  const myData = {
      portfolio: arrDeals,
      chartData: myLiquidityArray
  }
  
  return myData;
}

const createLibrary = (tokenData, myToken0Symbol) => {
  const tokenDayData0 = {};
  const tokenDayData1 = {};
      tokenData.map(tokenDatum => {
          const symbol = tokenDatum.token.symbol;
          if((tokenDatum.date in tokenDayData0) || (tokenDatum.date in tokenDayData1)){
              if(symbol === myToken0Symbol){
                  tokenDayData0[tokenDatum.date] = tokenDatum.priceUSD;
              } else {
                  tokenDayData1[tokenDatum.date] = tokenDatum.priceUSD;
              }
          } else {
              if(symbol === myToken0Symbol){
                  tokenDayData0[tokenDatum.date] = tokenDatum.priceUSD;
                  tokenDayData1[tokenDatum.date] = 0;
              } else {
                  tokenDayData0[tokenDatum.date] = 0;
                  tokenDayData1[tokenDatum.date] = tokenDatum.priceUSD
              }
          }
      });
      return [tokenDayData0, tokenDayData1]
}

  
export default App;
  