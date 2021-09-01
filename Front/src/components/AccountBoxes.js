import React from "react";
function AccountBoxes(props) {
  const { title, value } = props;

  return (
    <div>
      <h1>{value}</h1>
      <p>{title}</p>
    </div>
  );
}

export default AccountBoxes;