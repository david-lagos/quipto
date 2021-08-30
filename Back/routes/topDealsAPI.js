const express = require("express");
const router = express.Router();
const GetPoolData = require("./getPoolData");
router.get("/", function (req, res, next) {
  let formatTvl = (n) => {
    // console.log(n)
    if (n < 1e3) return n;
          if (n >= 1e3 && n < 1e6) return  +(n / 1e3).toFixed(0) + "k";
          if (n >= 1e6 && n < 1e9) return  +(n / 1e6).toFixed(1) + "m";
          if (n >= 1e9 && n < 1e12) return  +(n / 1e9).toFixed(1) + "b";
          if (n >= 1e12) return  +(n / 1e12).toFixed(1) + "t";
  };

  GetPoolData.getPairs().then(async (arrayPairs) => {
    const arr = [];
    

    await Promise.all(
      arrayPairs.map(async (value) => {
        let data = await GetPoolData.getHourData(value.id);
        let sum = data.pairHourDatas.reduce((acc, val) => {
          return {
            hourlyVolumeUSD: parseFloat(acc["hourlyVolumeUSD"]) + parseFloat(val["hourlyVolumeUSD"])
          };
        });

        // Sort daily data asc
        const sortedDaily = data.pairDayDatas.sort((a,b) => {
          return a.date - b.date;
        });

        // Build historical data array
        const dayData = [];
        sortedDaily.map(pos => {
          let date = new Date(0);
          date.setUTCSeconds(pos.date);
          date = date.toISOString().substring(0, 10);
          dayData.push({
            date,
            timestamp: pos.date,
            yield: ((parseFloat(pos.dailyVolumeUSD) * 0.003 / parseFloat(pos.reserveUSD)) * 100).toPrecision(2)
          })
        });


        arr.push({
          id: value.id,
          token0: {
            id: value.token0.id,
            symbol: value.token0.symbol
          },
          token1: {
            id: value.token1.id,
            symbol: value.token1.symbol
          },
          // liquidity: value.reserveUSD,
          liquidity: formatTvl(parseFloat(value.reserveUSD)),
          volume24h: sum["hourlyVolumeUSD"].toString(),
          fees24h: (sum["hourlyVolumeUSD"] * 0.003).toString(),
          //lastHour: data[0]['hourStartUnix'],
          yield:
            ((sum["hourlyVolumeUSD"] * 0.003 / value.reserveUSD) * 9000),
          
          yieldPer:
            ((sum["hourlyVolumeUSD"] * 0.003 / value.reserveUSD) * 9000).toFixed(2) + "%",
          last30: dayData
        });
      })
    );

    arr.sort((a,b) => {
      return b.yield - a.yield;
    });
    res.send(arr);
  });
});

module.exports = router;
