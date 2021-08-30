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

  useEffect(() => {
  setTimeout(() => {
    if(provider.current.selectedAddress !== null) {
      console.log('Hello, you are logged in');
      setIsLoggedIn(true);
      setAddress(provider.current.selectedAddress);
      getInvestments(provider.current.selectedAddress).then(portfolio => {
        setPortfolio(portfolio);
      });
    } else {
      console.log('You are not logged in');
      setPortfolio([]);
    }
  }, 500);

  provider.current.on('accountsChanged', (accounts) => {
    if(!accounts.length){
      setAddress('Connect Wallet');
      setIsLoggedIn(false);
      setPortfolio([]);
    } else {
      setAddress(provider.current.selectedAddress);
      setIsLoggedIn(true);
      getInvestments(provider.current.selectedAddress).then(portfolio => setPortfolio(portfolio));
    }
  });
  }, [])


  return (
    <div className="App">
      <Header address={address} onClick={() => connect()}></Header>
      <Slider/>
      <Home portfolio={portfolio} isLoggedIn={isLoggedIn}/>
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
  
  const positions = await GetPoolData.getPositions(address);
  //console.log(positions);
  const arrDeals = [];
  
  
  await Promise.all(positions.map(async(pos) => {
    const arrFees = [];
    
    // Get pool id
    const snap = await GetPoolData.getSnapshot(pos.id);
    const pairId = snap.id.split('-')[0];

    const share = parseFloat(snap.liquidityTokenBalance)/parseFloat(snap.liquidityTokenTotalSupply);
    
    const stake0Then = share * parseFloat(snap.reserve0);
    const stake1Then = share * parseFloat(snap.reserve1);

    //console.log('locked0 then: ', stake0Then);
    //console.log('locked1 then: ', stake1Then);
    
  // Midnight next day
    let date = new Date(0);
    date.setUTCSeconds(snap.timestamp);
    date.setUTCHours(0,0,0);
    date.setDate(date.getDate() + 1);
    const midnightNextDay = Math.floor(date / 1000);
    
    // Fetch historical data
    const pair = await GetPoolData.getHistoricalData(pairId, snap.timestamp, midnightNextDay);

    // Reduce swaps on day stake was made
    const sum = pair.swaps.reduce((a,b) => {
      return { amountUSD: parseFloat(a.amountUSD) + parseFloat(b.amountUSD) }
    });

    date.setDate(date.getDate() - 1);
    const stampStakeDay = Math.floor(date / 1000);

    // Reduce swaps on other days
    const sumDay = pair.pairDayDatas.reduce((a,b) => {
      return { dailyVolumeUSD: parseFloat(a.dailyVolumeUSD) + parseFloat(b.dailyVolumeUSD) }
    });

    // Get share
    const pairNow = pair.pairs[0];
    const supplyNow = parseFloat(pairNow.totalSupply);
    const shareNow = parseFloat(snap.liquidityTokenBalance) / supplyNow;

    // Get tokens locked
    const stake0Now = parseFloat(pairNow.reserve0) * shareNow;
    console.log('locked0 now: ', stake0Now); 
    const stake1Now = parseFloat(pairNow.reserve1) * shareNow;
    console.log('locked1 now: ', stake1Now);

    // Get eth price
    const eth = pair.bundles[0].ethPrice;

    // Print fees in USD
    const feesEarned = (sumDay.dailyVolumeUSD + sum.amountUSD) * 0.003 * shareNow;
    //console.log('fees earned: ', feesEarned);
    
    // Build historical data
    let firstDay = new Date(0);
    firstDay.setUTCSeconds(stampStakeDay);
    firstDay = firstDay.toISOString().substring(0, 10);
    const stakeDay = {
        timestamp: stampStakeDay,
        date: firstDay,
        feesUSD: sum.amountUSD * 0.003 * shareNow,
        yield: parseFloat((sum.amountUSD * 0.003 * shareNow).toPrecision(3))
    }

    pair.pairDayDatas.map((pos) => {
      let date = new Date(0);
      date.setUTCSeconds(pos.date);
      date = date.toISOString().substring(0, 10);
      const obj = {
        timestamp: pos.date,
        date: date,
        feesUSD: parseFloat(pos.dailyVolumeUSD) * 0.003 * shareNow,
        yield: parseFloat((parseFloat(pos.dailyVolumeUSD) * 0.003 * shareNow).toPrecision(3))
      }
      arrFees.push(obj);
    });

    arrFees.push(stakeDay);
    
    arrFees.sort((a, b) => {
      return a.timestamp - b.timestamp
    });

    
    const cumArray = arrFees.map(cumulativeSum);
    console.log(cumArray);
    const arrApex = [];
        cumArray.map(pos => {
            const helperArr = [];
            helperArr.push(pos.timestamp * 1000);
            helperArr.push(pos.yield);
            arrApex.push(helperArr);
        });

    // Build deal object
    const dealObj = {
      token0: pair.pairs[0].token0.symbol,
      token1: pair.pairs[0].token1.symbol,
      initial: stake0Then + (stake1Then * eth),
      current: stake0Now + (stake1Now * eth) + feesEarned,
      feesEarned,
      days: arrFees.length - 1,
      data: cumArray,
      apexData: {
        data: arrApex
      }
    }

   arrDeals.push(dealObj);
    
  }));
  console.log(arrDeals);
  return arrDeals;
}

const cumulativeSum = (sum => pos => {
  return {
      date: pos.date,
      timestamp: pos.timestamp,
      yield: parseFloat((sum += pos.yield).toPrecision(3))
  };
})(0);
  
export default App;
  