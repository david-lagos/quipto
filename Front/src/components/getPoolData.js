const axios = require('axios');

const getPriceData = async(tokenKey) => {
    const result = await axios.post('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
    {
        query: `
        {
            tokenHourDatas(first: 1 where: {token: "${tokenKey}"} orderBy: periodStartUnix orderDirection: desc){
              priceUSD
            }
        }`
    });
    
    return result.data.data.tokenHourDatas;
}

const getPositions = async(address) => {
    
    const result = await axios.post('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    {
        query:`
        {
            users(first: 1 where:{id: "${address}"}){
                liquidityPositions{
                    id
                }
            }
        }`
    });

    return result.data.data.users[0].liquidityPositions;
}

const getSnapshot = async(position) => {

    const result = await axios.post('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    {
        query:`{
            liquidityPositionSnapshots(where:{liquidityPosition: "${position}"} orderBy: timestamp orderDirection: desc){
                id
                timestamp
                liquidityTokenBalance
                liquidityTokenTotalSupply
                reserve0
                reserve1        
            }
        }`
    });

    return result.data.data.liquidityPositionSnapshots[0];
}

const getHistoricalData = async(poolKey, time, date) => {

    const result = await axios.post('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    {
        query:`
        {
            pairDayDatas(where: {pairAddress: "${poolKey}" date_gte: ${date}} orderBy: date orderDirection: desc){
                date
                dailyVolumeUSD
            }
            pairs(where:{id: "${poolKey}"}){
              token0{
                symbol
              }
              token1{
                symbol
              }
              reserve0
              reserve1
              totalSupply
            }
            bundles(first: 1){
                ethPrice
            }
            swaps(first: 1000 where:{timestamp_gte: ${time} timestamp_lt: ${date} pair: "${poolKey}"} orderBy: timestamp orderDirection: asc){
                amountUSD
                timestamp
                }
        }`
    });
    
    return result.data.data;
}

module.exports = { getPriceData, getPositions, getSnapshot, getHistoricalData }