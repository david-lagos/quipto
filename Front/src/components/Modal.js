import "./Modal.css";
import { ethers } from 'ethers';
import { ChainId, Fetcher, Route, Price, Token } from '@uniswap/sdk';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import GetPoolData from './getPoolData';
import CurrencyRow from './CurrencyRow';
import Estimates from './Estimates';
import Authorize from './Authorize';
import Confirm from './Confirm';



const Modal = ({
  isOpen,
  closeModal,
  title,
  children,
  firstTokenSymbol,
  secondTokenSymbol,
  isLoggedIn
  
}) => {



  const pool = {
    ids: {
      from: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
      to: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
    },
    symbols: {
      from: firstTokenSymbol,
      to: secondTokenSymbol
    },
    decimals:{
      from: 18,
      to: 18
    },
    fees24h: 1000
  };
  
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [fromBalance, setFromBalance] = useState();
  const [toBalance, setToBalance] = useState();
  const [fromPrice, setFromPrice] = useState(0);
  const [toPrice, setToPrice] = useState(0);
  const [isFromAuthorized, setIsFromAuthorized] = useState(false);
  const [isToAuthorized, setIsToAuthorized] = useState(false);
  const [poolLiquidity, setPoolLiquidity] = useState(1);
  const [numerator, setNumerator] = useState(1);
  const [denominator, setDenominator] = useState(1);
  const [token0, setToken0] = useState(new Token(4, pool.ids.from, pool.decimals.from, pool.symbols.from));
  const [token1, setToken1] = useState(new Token(4, pool.ids.to, pool.decimals.to, pool.symbols.to));
  const [amount, setAmount] = useState('');
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
    
  let toAmount, fromAmount
  
  if(amountInFromCurrency){
    fromAmount = amount
    toAmount = precise(amount, numerator, denominator, token0.decimals, true);
  } else {
    toAmount = amount
    fromAmount = precise(amount, denominator, numerator, token0.decimals, false)
  }  

  let dailyIncome, monthlyIncome

  dailyIncome = calculateIncome(1);
  monthlyIncome = calculateIncome(30);

  useEffect(() => {

    // Scope for these two is local
    const fromCurrency = pool.symbols.from;
    const toCurrency = pool.symbols.to;
    
    // State setters
    setCurrencyOptions([...Object.values(pool.symbols)])
    setFromCurrency(fromCurrency)
    setToCurrency(toCurrency)
    getMidPrice(pool).then(({midPriceNum, midPriceDen, token0, token1, balance0, balance1, price0, price1, allowance0, allowance1, poolLiquidity}) => {
      setNumerator(midPriceNum)
      setDenominator(midPriceDen)
      setToken0(token0);
      setToken1(token1);
      setFromBalance(balance0);
      setToBalance(balance1);
      setFromPrice(price0);
      setToPrice(price1);
      setIsFromAuthorized(allowance0);
      setIsToAuthorized(allowance1);
      setPoolLiquidity(poolLiquidity);
    });
  }, []) 

  // Functions
  
  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  function handleAuthOnClick(e, token) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const routerAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

    const tokenContract = new ethers.Contract(
      token.address,
      [
      'function approve(address spender, uint rawAmount) external returns (bool)',
      'function allowance(address owner, address spender) external view returns (uint)',
      'function balanceOf(address account) external view returns (uint)'
      ],
      signer
    );

    tokenContract.approve(routerAddress, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff').then(result => {
      provider.once(result.hash, () => {
        if(token.symbol === token0.symbol){
          setIsFromAuthorized(true);
          console.log(`Your ${token.symbol} has been approved for spending`);
        } else if (token.symbol === token1.symbol){
          setIsToAuthorized(true);
          console.log(`Your ${token.symbol} has been approved for spending`);
        }
      })
    });

  }

  const getMidPrice = async(pool) => {
      
    // Set chain id
    const chainId = ChainId.RINKEBY;
    
    // Define provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    const routerAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

    // Create token and pair instances
    const token0 = await Fetcher.fetchTokenData(chainId, pool.ids.from, provider, pool.symbols.from);
    const token1 = await Fetcher.fetchTokenData(chainId, pool.ids.to, provider, pool.symbols.to);
    const pair = await Fetcher.fetchPairData(token0, token1, provider);
    const route = new Route([pair], token0);

    const token0Contract = new ethers.Contract(
      token0.address,
      [
      'function approve(address spender, uint rawAmount) external returns (bool)',
      'function allowance(address owner, address spender) external view returns (uint)',
      'function balanceOf(address account) external view returns (uint)'
      ],
      signer
    );

    const token1Contract = new ethers.Contract(
      token1.address,
      [
      'function approve(address spender, uint rawAmount) external returns (bool)',
      'function allowance(address owner, address spender) external view returns (uint)',
      'function balanceOf(address account) external view returns (uint)'
      ],
      signer
    );
    
    let balance0, balance1;
    let allowance0, allowance1;
    console.log(isLoggedIn);
    if(isLoggedIn){
    const address = await signer.getAddress();
    const balance0Obj = await token0Contract.balanceOf(address);
    balance0 = parseFloat(ethers.utils.formatUnits(balance0Obj.toString(), token0.decimals)).toFixed(3);
    const balance1Obj = await token1Contract.balanceOf(address);
    balance1 = parseFloat(ethers.utils.formatUnits(balance1Obj.toString(), token1.decimals)).toFixed(3);
    
    if(token0.symbol !== 'WETH'){
      const allowance0Obj = await token0Contract.allowance(address, routerAddress);
      allowance0 = parseFloat(allowance0Obj.toString());
    } else {
      allowance0 = 1;
    }
    if(token1.symbol !== 'WETH') {
      const allowance1Obj = await token1Contract.allowance(address, routerAddress);
      allowance1 = parseFloat(allowance1Obj.toString());
    } else {
      allowance1 = 1;
    }
    
    } else {
      balance0 = 0;
      balance1 = 0;
      allowance0 = 0;
      allowance1 = 0;
    }    

    const price0 = await getPrice(pool.ids.from);
    const price1 = await getPrice(pool.ids.to);

    const liquidity0 = parseFloat(ethers.utils.formatUnits(pair.reserveOf(token0).raw.toString(), token0.decimals));
    const liquidity1 = parseFloat(ethers.utils.formatUnits(pair.reserveOf(token1).raw.toString(), token1.decimals));

    const poolLiquidity = (liquidity0 * price0) + (liquidity1 * price1);

    // Return elements
    return {
      midPriceNum: route.midPrice.numerator,
      midPriceDen: route.midPrice.denominator,
      token0,
      token1,
      balance0,
      balance1,
      price0,
      price1,
      allowance0,
      allowance1,
      poolLiquidity
    }
  }

  function precise(amount, num, den, decimals, amountInFrom) {
    if (amount === ''){
      return '';
    } else {
    // Convert numerator and input to Fixed Number
    console.log(decimals);
    console.log(num.toString());
    const fixNum = ethers.FixedNumber.fromString(num.toString(), decimals);
    const fixAmount = ethers.FixedNumber.from(amount);
    console.log(fixNum);
    console.log(fixAmount);
    
    // Multiply numerator by input value, trim decimals on string representation
    const newNum = fixNum.mulUnsafe(fixAmount);
    const splitArr = newNum.toString().split('.');

    // Replace numerator with new value
    let newPrice;
    
    if(amountInFrom){
      newPrice = new Price(token0, token1, den, splitArr[0]);
    } else {
      newPrice = new Price(token1, token0, den, splitArr[0]);
    }
    return newPrice.toSignificant(6)
    }
  }

  const getPrice = async(tokenId) => {
    if(tokenId === '0xc778417E063141139Fce010982780140Aa0cD5Ab'){
        let price = await axios.get("https://api.coingecko.com/api/v3/simple/price/", {
            params: {
                ids: 'ethereum',
                vs_currencies: 'usd'
            }
        });
        return price.data.ethereum.usd;
    } else if (tokenId === '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea') {
      let price = await axios.get("https://api.coingecko.com/api/v3/simple/price/", {
            params: {
                ids: 'dai',
                vs_currencies: 'usd'
            }
        });
        return  price.data.dai.usd
    } else if (tokenId.toLowerCase() === '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b') {
      let price = await axios.get("https://api.coingecko.com/api/v3/simple/price/", {
            params: {
                ids: 'usd-coin',
                vs_currencies: 'usd'
            }
        });
        return  price.data['usd-coin'].usd;
    } else {
        let price = await GetPoolData.getPriceData(tokenId.toLowerCase());  
        return parseFloat(parseFloat(price[0].priceUSD).toFixed(2));
    }
  }

  function calculateIncome(days) {
    const myLiquidity = (fromAmount * fromPrice) + (toAmount * toPrice);
    const myShare = (myLiquidity / (myLiquidity + poolLiquidity) * 100);
    const myReturn = (myShare * pool.fees24h * days).toFixed(2);
    return myReturn;
  }

  const handleConfirmOnClick = async(e) => {

    // Initialize variables
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
    const routerAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const value0 = ethers.utils.parseUnits(fromAmount, token0.decimals);
    const value1 = ethers.utils.parseUnits(toAmount, token1.decimals);
    console.log(value0.toString());
    console.log(value1.toString());

    // Create contract instance
    const routerContract = new ethers.Contract(
      routerAddress,
      [
      'function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
      'function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)',
      'function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)'
      ],
      signer
    );

    if(token0.symbol === 'WETH') {

      // ETH is in FROM position
      const addETH = await routerContract.addLiquidityETH(
        token1.address,
        value1.toString(),
        0,
        0,
        address,
        deadline,
        { value: ethers.utils.parseEther(fromAmount), gasLimit: 2000000 }
      );

      provider.once(addETH.hash, (transaction) => {
        console.log('Your transaction was confirmed');
        console.log(transaction);
      });

    } else if(token1.symbol === 'WETH') {
      
      // ETH is in TO position
      const addETH = await routerContract.addLiquidityETH(
        token0.address,
        value0.toString(),
        0,
        0,
        address,
        deadline,
        { value: ethers.utils.parseEther(toAmount), gasLimit: 2000000 }
      );

      provider.once(addETH.hash, (transaction) => {
        console.log('Your transaction has been confirmed');
        console.log(transaction);
      });

    } else {

      // ETH is neither in TO or FROM position
      const addLiquidity = await routerContract.addLiquidity(
        token0.address,
        token1.address,
        value0,
        value1,
        0,
        0,
        address,
        deadline
      );

      provider.once(addLiquidity.hash, () => {
        console.log('Your transaction was confirmed');
      })
    }
  }

  let needFromAuth = false;
  let needToAuth = false;
  if(!isFromAuthorized) {
    needFromAuth = true;
  }
  if(!isToAuthorized) {
    needToAuth = true;
  }

  const handleModalDialogClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={`modal ${isOpen && "modal-open"}`} onClick={closeModal}>
      <div className="modal__dialog" onClick={handleModalDialogClick}>
        <div className="title-close-container">
          <div className="title">
            <h1 className="modal-title">{title}</h1>
          </div>
          <div className="titleCloseBtn">
            <button onClick={closeModal}>X</button>
          </div>
        </div>
        <div className="pair-title">
          <p>Commit to Pool</p>
          <h1>
            UNISWAP {firstTokenSymbol} / {secondTokenSymbol}
          </h1>
        </div>
        <div className="exchange">
          <div className="currency-1">
            <p>
              <b>Currency 1</b>
            </p>
            <CurrencyRow
              currencyOptions={currencyOptions}
              selectedCurrency={fromCurrency}
              onChangeCurrency={(e) => setFromCurrency(e.target.value)}
              onChangeAmount={handleFromAmountChange}
              amount={fromAmount}
              balance={fromBalance}
            />
            <div className="equals">=</div>
          </div>

          <div className="currency-2">
            <p>
              <b>Currency 2</b>
            </p>

            <CurrencyRow
              currencyOptions={currencyOptions}
              selectedCurrency={toCurrency}
              onChangeCurrency={(e) => setToCurrency(e.target.value)}
              onChangeAmount={handleToAmountChange}
              amount={toAmount}
              balance={toBalance}
            />
          </div>
        </div>
          <Estimates dailyIncome={dailyIncome} monthlyIncome={monthlyIncome} />
          <div className="aprove-buttons">
          
          {needFromAuth || needToAuth ? (
            <div>
              <Authorize
                currency={fromCurrency}
                needAuth={needFromAuth}
                onClick={(e) => handleAuthOnClick(e, token0)}
              />
              <Authorize
                currency={toCurrency}
                needAuth={needToAuth}
                onClick={(e) => handleAuthOnClick(e, token1)}
              />
              <p>By confirming you accept the terms & conditions, privacy policy and information collection notice</p>
            </div>
          ) : (
            <div>
              <Confirm onClick={(e) => handleConfirmOnClick(e)}/>
            </div>
          )}
          
        </div>
        {children}
      </div>
      </div>
  );
};

export default Modal;
