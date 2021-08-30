import React from 'react';
import './Authorize.css'

export default function Authorize(props) {
    
    const {
        currency,
        needAuth,
        onClick
    } = props

    return(
   
        <button classname="myButton" style={needAuth ? {display: ''} : {display: 'none'} } onClick={onClick}> Authorize {currency}</button>
    )
}