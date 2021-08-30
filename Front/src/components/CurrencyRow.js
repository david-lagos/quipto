import React from "react";
import "./currencyRow.css";
export default function CurrencyRow(props) {
  const {
    currencyOptions,
    selectedCurrency,
    onChangeCurrency,
    onChangeAmount,
    amount,
    balance,
  } = props;
  return (
    <div>
      <div className="form">
        <input
          type="number"
          className="input"
          value={amount}
          onChange={onChangeAmount}
          placeholder="0.00"
        />
        <div className="filter-modal">
          <select
            value={selectedCurrency}
            onChange={onChangeCurrency}
            id="modal_filter"
          >
            {currencyOptions.map((option) => {
              return (
                <option key={option} value={option}>
                  {option}
                </option>
              );
            })}
          </select>
        </div>
        <span className="balance">
          <p> Wallet balance:</p>{" "}
          <p>
            {" "}
            {balance} {selectedCurrency}
          </p>
        </span>
      </div>
    </div>
  );
}
