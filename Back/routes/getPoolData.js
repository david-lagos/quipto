const axios = require('axios');

// Formats number into currency
var tvl = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

// This function takes the output of the query after destructuring and prints TVL by day to the console
const printArray = (array) => {
    console.log('TVL(in millions) by day');
    for(let i=1; i < array.length; i++){
        let date = new Date(array[i]['date'] * 1000);
        console.log(`${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getFullYear()}`, tvl.format(array[i]['tvlUSD']/ 1000000) + 'm');
    }
}

// This function returns a promise that fulfills to the TVL in the entered pool
const getTVL = async() => {
    try{
        const result = await axios.post('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
        {
            query: `
            {
            pools(orderBy: totalValueLockedETH  orderDirection: desc first: 4 ){
                id
                totalValueLockedToken0
                totalValueLockedToken1
                token0{
                    symbol
                    
                }
                token1{
                    symbol
                    
                }
                poolDayData{
                    id
                    date
                    tvlUSD
                    feesUSD
                }
                totalValueLockedETH
                feeGrowthGlobal0X128

            }
            }
            `
        });
        // Object is destructured and array within is sent to the printArray function
        //Object.entries(result.data.data).map(([key, value]) => Object.entries(value).map(([key2, { poolId, poolDayData }]) => printArray(poolDayData)));
        //Object.values(result.data.data).map(value => Object.values(value).map(({ poolId, poolDayData}) => printArray(poolDayData)));
        return result.data.data.pools;
    } catch(error) {
        console.error(error);
    }
}



const getPairs = async() => {

    const result = await axios.post('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    {
        query: `
        {
            pairs(first: 5
              where: {txCount_gt: 10000}
              orderBy: reserveUSD
              orderDirection: desc){
              id
              reserveUSD
              token0{
                id
                symbol
              }
              token1{
                id
                symbol
              }
            }
        }`
    });
    return result.data.data.pairs;
}

const getDayData = async(pairKey) => {
    
    const result = await axios.post('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    {
        query: `
        {
            pairDayDatas(first: 1, where: {pairAddress: "${pairKey}"} orderBy: date orderDirection: desc){
              reserveUSD
              dailyVolumeUSD
            }
          }`
    });
    return result.data.data.pairDayDatas;
}


const getHourData = async(poolKey) => {

    let date = new Date();
    date.setHours(date.getHours() + 1);
    date.setMinutes(0,0,0);
    date.setDate(date.getDate() - 1);
    date = Math.floor(date / 1000);

    let last30 = new Date();
    last30.setUTCHours(0,0,0,0)
    last30.setDate(last30.getDate() - 30);
    last30 = Math.floor(last30 / 1000);

    const result = await axios.post('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    {
        query: `
        {
            pairHourDatas(where: {hourStartUnix_gte: ${date} pair: "${poolKey}"} orderBy: hourStartUnix orderDirection: desc){
              hourlyVolumeUSD
              hourStartUnix
            }
            pairDayDatas(where: {date_gte: ${last30} pairAddress: "${poolKey}"} orderBy: date orderDirection: desc){
                date
                reserveUSD
                dailyVolumeUSD
              }
        }`
    });
    
    return result.data.data;
}

module.exports = { getTVL, getPairs, getDayData, getHourData, printArray };