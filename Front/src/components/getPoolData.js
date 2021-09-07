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

const getSnapshots = async(position, poolKey) => {

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
                reserveUSD
                token0PriceUSD
                token1PriceUSD
            }
            pairs(where: {id: "${poolKey}"}){
                id
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

    return result.data.data;
}

const getHistoricalData = async(poolKey, time, date, tk0, tk1) => {

    let firstDay = new Date(time * 1000);
    firstDay.setUTCHours(0,0,0);
    firstDay = Math.floor(firstDay / 1000);

    const result = await axios.post('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    {
        query:`
        {
            pairDayDatas(first: 1000 where: {pairAddress: "${poolKey}" date_gte: ${date}} orderBy: date orderDirection: asc){
                date
                dailyVolumeUSD
                dailyVolumeToken0
                dailyVolumeToken1
                totalSupply
                reserveUSD
                reserve0
                reserve1
            }
            bundles(first: 1){
                ethPrice
            }
            swaps(first: 1000 where:{timestamp_gte: ${time} timestamp_lt: ${date} pair: "${poolKey}"} orderBy: timestamp orderDirection: asc){
                amountUSD
                timestamp
                amount0In
                amount1In
            }
            tokenDayDatas(first: 1000 where: {token_in: ["${tk0}", "${tk1}"] date_gte: ${firstDay}} orderBy: date orderDirection: asc){
               token{
                   symbol
               }
               date
               priceUSD
            }
        }`
    });
    
    return result.data.data;
}

module.exports = { getPriceData, getPositions, getSnapshots, getHistoricalData }