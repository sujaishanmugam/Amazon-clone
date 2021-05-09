import React, { useEffect, useState } from "react";
import CheckoutProduct from "./CheckoutProduct";
import "./Payment.css";
import { useStateValue } from "./StateProvider";
import { Link, useHistory } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "./reducer";
import axios from "./axios";

function Payment() {
  const [{ basket, user }, dispatch] = useStateValue();
 const history = useHistory();
  const stripe = useStripe();
  const elements = useElements();

  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState(true);

  useEffect(() =>{

    const getClientSecret = async () => {
      const response = await axios({
        method: 'POST',
        url: `/payments/create?total=${getBasketTotal(basket)}`
      })
      setClientSecret(response.data.clientSecret)

    }
    getClientSecret();
  },[basket])
  console.log("The secret is >>>>>> ", clientSecret)
  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    }).then(( {paymentIntent}) => {
        // payment confirmation
        setSucceeded(true);
        setError(null);
        setProcessing(false);

        history.replace('/orders')
    })
  };
  const handleChange = (event) => {
    // listens the change in cardelement
    // and display any errors
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };
  return (
    <div className="payment">
      <div className="payment__container">
        <h1>
          Checkout (<Link to="/checkout">{basket?.length} items</Link>)
        </h1>
        {/* payment sec / address */}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment__address">
            <p>{user?.email}</p>
            <p>NO 40 Marina beach</p>
            <p>Chennai,India</p>
          </div>
        </div>
        {/* payment sec / items review */}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Review Items and Delivery</h3>
          </div>
          <div className="payment__items">
            {basket.map((item) => (
              <CheckoutProduct
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>
        {/* payment sec / Payment Method*/}
        <div className="payment__section"></div>
        <div className="payment__title">
          <h3>Payment Method</h3>
        </div>
        <div className="payment__details">
          {/* Stripe payment */}
          <form onSubmit={handleSubmit}>
            <CardElement onChange={handleChange} />
            <div className="payment__priceContainer">
              <CurrencyFormat
                renderText={(value) => <h3>Order Total: {value}</h3>}
                decimalScale={2}
                value={getBasketTotal(basket)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"₹"}
              />
              <button disabled={processing || disabled || succeeded}>
                <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
              </button>
            </div>
            {/* Errors */}
            {error && <div>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Payment;
