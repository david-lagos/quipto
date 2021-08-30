import React, { useEffect, useState } from "react";

const Slider = () => {
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
  const [coins, setCoins] = useState();
  const fetchApi = async () => {
    const response = await fetch(url);
    const responseJSON = await response.json();

    setCoins(responseJSON);
  };

  useEffect(() => {
    fetchApi();
  }, []);

  return (
    <div className="container-slider">
      <h1 className="slider-title">Top Coins</h1>
      <div className="slide-track">
        {/******************5 Slides************************/}

        {/* BTC STARTS */}
        <div className="slide">
          <div>
            {coins ? (
              coins.map((coin, index) => {
                return (
                  <div>
                    {coin.symbol === "btc" ? (
                      <div className="stock">
                        <div className="coin-image">
                          <img src={coin.image} alt="logo" />
                        </div>
                        <div className="data">
                          <p className="coin-symbol">{coin.symbol}</p>
                          <div className="data-percent">
                            <p className="coin-percent-price">
                              $
                              {coin.current_price.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </p>

                            {/* Price Change Color  */}
                            {coin.price_change_percentage_24h < 0 ? (
                              <p className="coin-percent red">
                                {coin.price_change_percentage_24h.toFixed(2)}%
                              </p>
                            ) : (
                              <p className="coin-percent green">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="10"
                                  height="10"
                                  fill="currentColor"
                                  class="bi bi-caret-up-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                </svg>
                                {coin.price_change_percentage_24h.toFixed(2)}%
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        {/* BTC ENDS*/}

        {/* ETH STARTS */}
        <div className="slide">
          <div>
            {coins ? (
              coins.map((coin, index) => {
                return (
                  <div>
                    {coin.symbol === "eth" ? (
                      <div className="stock">
                        <div className="coin-image">
                          <img src={coin.image} alt="logo" />
                        </div>
                        <div className="data">
                          <p className="coin-symbol">{coin.symbol}</p>
                          <div className="data-percent">
                            <p className="coin-percent-price">
                              $
                              {coin.current_price.toLocaleString(undefined, {
                                maximumFractionDigits: 1,
                              })}
                            </p>

                            {/* Price Change Color  */}
                            {coin.price_change_percentage_24h < 0 ? (
                              <p className="coin-percent red">
                                {coin.price_change_percentage_24h.toFixed(2)}%
                              </p>
                            ) : (
                              <p className="coin-percent green">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="10"
                                  height="10"
                                  fill="currentColor"
                                  class="bi bi-caret-up-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                </svg>
                                {coin.price_change_percentage_24h.toFixed(2)}%
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        {/* ETH ENDS*/}

        {/* USDT STARTS */}
        <div className="slide">
          <div>
            {coins ? (
              coins.map((coin, index) => {
                return (
                  <div>
                    {coin.symbol === "usdt" ? (
                      <div className="stock">
                        <div className="coin-image">
                          <img src={coin.image} alt="logo" />
                        </div>
                        <div className="data">
                          <p className="coin-symbol">{coin.symbol}</p>
                          <div className="data-percent">
                            <p className="coin-percent-price">
                              ${coin.current_price.toFixed(2)}
                            </p>

                            {/* Price Change Color  */}
                            {coin.price_change_percentage_24h < 0 ? (
                              <p className="coin-percent red">
                                {coin.price_change_percentage_24h.toFixed(2)}%
                              </p>
                            ) : (
                              <p className="coin-percent green">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="10"
                                  height="10"
                                  fill="currentColor"
                                  class="bi bi-caret-up-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                </svg>
                                {coin.price_change_percentage_24h.toFixed(2)}%
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        {/* USDT ENDS*/}

        {/* BNB STARTS */}
        <div className="slide">
          <div>
            {coins ? (
              coins.map((coin, index) => {
                return (
                  <div>
                    {coin.symbol === "bnb" ? (
                      <div className="stock">
                        <div className="coin-image">
                          <img src={coin.image} alt="logo" />
                        </div>
                        <div className="data">
                          <p className="coin-symbol">{coin.symbol}</p>
                          <div className="data-percent">
                            <p className="coin-percent-price">
                              $
                              {coin.current_price.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </p>

                            {/* Price Change Color  */}
                            {coin.price_change_percentage_24h < 0 ? (
                              <p className="coin-percent red">
                                {coin.price_change_percentage_24h.toFixed(2)}%
                              </p>
                            ) : (
                              <p className="coin-percent green">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="10"
                                  height="10"
                                  fill="currentColor"
                                  class="bi bi-caret-up-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                </svg>
                                {coin.price_change_percentage_24h.toFixed(2)}%
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        {/* BNB ENDS*/}

        {/* ADA STARTS */}
        <div className="slide">
          <div>
            {coins ? (
              coins.map((coin, index) => {
                return (
                  <div>
                    {coin.symbol === "ada" ? (
                      <div className="stock">
                        <div className="coin-image">
                          <img src={coin.image} alt="logo" />
                        </div>
                        <div className="data">
                          <p className="coin-symbol">{coin.symbol}</p>
                          <div className="data-percent">
                            <p className="coin-percent-price">
                              $
                              {coin.current_price.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </p>

                            {/* Price Change Color  */}
                            {coin.price_change_percentage_24h < 0 ? (
                              <p className="coin-percent red">
                                {coin.price_change_percentage_24h.toFixed(2)}%
                              </p>
                            ) : (
                              <p className="coin-percent green">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="10"
                                  height="10"
                                  fill="currentColor"
                                  class="bi bi-caret-up-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                </svg>
                                {coin.price_change_percentage_24h.toFixed(2)}%
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        {/* ADA ENDS*/}

        {/******************5 Slides(DOUBLE)******************/}
        {/* BTC STARTS */}
        <div className="slide">
          <div>
            {coins ? (
              coins.map((coin, index) => {
                return (
                  <div>
                    {coin.symbol === "btc" ? (
                      <div className="stock">
                        <div className="coin-image">
                          <img src={coin.image} alt="logo" />
                        </div>
                        <div className="data">
                          <p className="coin-symbol">{coin.symbol}</p>
                          <div className="data-percent">
                            <p className="coin-percent-price">
                              $
                              {coin.current_price.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </p>

                            {/* Price Change Color  */}
                            {coin.price_change_percentage_24h < 0 ? (
                              <p className="coin-percent red">
                                {coin.price_change_percentage_24h.toFixed(2)}%
                              </p>
                            ) : (
                              <p className="coin-percent green">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="10"
                                  height="10"
                                  fill="currentColor"
                                  class="bi bi-caret-up-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                </svg>
                                {coin.price_change_percentage_24h.toFixed(2)}%
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        {/* BTC ENDS*/}

        {/* ETH STARTS */}
        <div className="slide">
          <div>
            {coins ? (
              coins.map((coin, index) => {
                return (
                  <div>
                    {coin.symbol === "eth" ? (
                      <div className="stock">
                        <div className="coin-image">
                          <img src={coin.image} alt="logo" />
                        </div>
                        <div className="data">
                          <p className="coin-symbol">{coin.symbol}</p>
                          <div className="data-percent">
                            <p className="coin-percent-price">
                              $
                              {coin.current_price.toLocaleString(undefined, {
                                maximumFractionDigits: 1,
                              })}
                            </p>

                            {/* Price Change Color  */}
                            {coin.price_change_percentage_24h < 0 ? (
                              <p className="coin-percent red">
                                {coin.price_change_percentage_24h.toFixed(2)}%
                              </p>
                            ) : (
                              <p className="coin-percent green">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="10"
                                  height="10"
                                  fill="currentColor"
                                  class="bi bi-caret-up-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                </svg>
                                {coin.price_change_percentage_24h.toFixed(2)}%
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        {/* ETH ENDS*/}

        {/* USDT STARTS */}
        <div className="slide">
          <div>
            {coins ? (
              coins.map((coin, index) => {
                return (
                  <div>
                    {coin.symbol === "usdt" ? (
                      <div className="stock">
                        <div className="coin-image">
                          <img src={coin.image} alt="logo" />
                        </div>
                        <div className="data">
                          <p className="coin-symbol">{coin.symbol}</p>
                          <div className="data-percent">
                            <p className="coin-percent-price">
                              ${coin.current_price.toFixed(2)}
                            </p>
                            {/* Price Change Color  */}
                            {coin.price_change_percentage_24h < 0 ? (
                              <p className="coin-percent red">
                               
                                {coin.price_change_percentage_24h.toFixed(2)}%
                              </p>
                            ) : (
                              <p className="coin-percent green">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="10"
                                  height="10"
                                  fill="currentColor"
                                  class="bi bi-caret-up-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                </svg>
                                {coin.price_change_percentage_24h.toFixed(2)}%
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        {/* USDT ENDS*/}

        {/* BNB STARTS */}
        <div className="slide">
          <div>
            {coins ? (
              coins.map((coin, index) => {
                return (
                  <div>
                    {coin.symbol === "bnb" ? (
                      <div className="stock">
                        <div className="coin-image">
                          <img src={coin.image} alt="logo" />
                        </div>
                        <div className="data">
                          <p className="coin-symbol">{coin.symbol}</p>
                          <div className="data-percent">
                            <p className="coin-percent-price">
                              $
                              {coin.current_price.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </p>

                            {/* Price Change Color  */}
                            {coin.price_change_percentage_24h < 0 ? (
                              <p className="coin-percent red">
                              
                                {coin.price_change_percentage_24h.toFixed(2)}%
                              </p>
                            ) : (
                              <p className="coin-percent green">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="10"
                                  height="10"
                                  fill="currentColor"
                                  class="bi bi-caret-up-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                </svg>
                                {coin.price_change_percentage_24h.toFixed(2)}%
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        {/* BNB ENDS*/}

        {/* ADA STARTS */}
        <div className="slide">
          <div>
            {coins ? (
              coins.map((coin, index) => {
                return (
                  <div>
                    {coin.symbol === "ada" ? (
                      <div className="stock">
                        <div className="coin-image">
                          <img src={coin.image} alt="logo" />
                        </div>
                        <div className="data">
                          <p className="coin-symbol">{coin.symbol}</p>
                          <div className="data-percent">
                            <p className="coin-percent-price">
                              $
                              {coin.current_price.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </p>

                            {/* Price Change Color  */}
                            {coin.price_change_percentage_24h < 0 ? (
                              <p className="coin-percent red">
                               
                                {coin.price_change_percentage_24h.toFixed(2)}%
                              </p>
                            ) : (
                              <p className="coin-percent green">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="10"
                                  height="10"
                                  fill="currentColor"
                                  class="bi bi-caret-up-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                </svg>
                                {coin.price_change_percentage_24h.toFixed(2)}%
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        {/* ADA ENDS*/}
      </div>
    </div>
  );
};

export default Slider;
