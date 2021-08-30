import React from "react";
import "../App.css";

import Modal from "../components/Modal";
import YieldModal from "./YieldModal";
import useModal from "../hooks/useModal";
import useModalYield from "../hooks/useModalYield";
const Deals = ({
  firstTokenId,
  firstTokenSymbol,
  secondTokenSymbol,
  TVL,
  yieldTotal,
  isLoggedIn,
  last30
}) => {

  const [isOpenModal, openModal, closeModal] = useModal();
  const [isOpenModalYield, openModalYield, closeModalYield] = useModalYield();
  
  return (
    <div className="coin-container">
      <div className="coin">
        <div class="rectangle rectangle-top">
          <table class="table top">
            <tbody>
              <tr>
                <th>Pair</th>
                <th>Total Liquidity</th>
                <th>Yield (90 Days)</th>
              </tr>
              <tr>
                <td>
                  {firstTokenSymbol} {secondTokenSymbol}
                </td>
                <td>${TVL}</td>
                <td>{yieldTotal}</td>
                <td>
                  <button onClick={openModal} className="myButton">
                    Invest
                  </button>
                  <Modal
                    key={isLoggedIn}
                    isOpen={isOpenModal}
                    closeModal={closeModal}
                    title="Add Liquidity"
                    firstTokenSymbol={firstTokenSymbol}
                    secondTokenSymbol={secondTokenSymbol}
                    yieldTotal={yieldTotal}
                    firstTokenId={firstTokenId}
                    isLoggedIn={isLoggedIn}
                  ></Modal>
                </td>
                <td>
                  <button onClick={openModalYield} className="button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      fill="currentColor"
                      class="bi bi-graph-up"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M0 0h1v15h15v1H0V0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5z"
                      />
                    </svg>
                  </button>
                  <YieldModal
                    isOpenYield={isOpenModalYield}
                    closeModalYield={closeModalYield}
                    title="Yield Graph"
                    yieldTotal={yieldTotal}
                    last30={last30}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Deals;
