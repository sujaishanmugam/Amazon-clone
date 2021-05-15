import React, { useEffect } from "react";
import "./App.css";
import Header from "./Header";
import Home from "./Home";
import Checkout from "./Checkout";
import Payment from "./Payment";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./Login";
import { auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

const promise = loadStripe('pk_test_51IkP0SSEqTd6aS60ul6xQlbHAsW36wbBN83qJ7jZNhx8vdT7u2W9s6Nly8I9GyyQUxrJQgU4fxnWNaiADfVcSWcX00ElhTWJUS')


function App() {
const [{}, dispatch] = useStateValue();
useEffect(() => {
  // will only run once when the app component loads...

  auth.onAuthStateChanged((authUser) => {
    console.log("THE USER IS >>> ", authUser);

    if (authUser) {
      // the user just logged in / the user was logged in

      dispatch({
        type: "SET_USER",
        user: authUser,
      });
    } else {
      // the user is logged out
      dispatch({
        type: "SET_USER",
        user: null,
      });
    }
  });
}, []);
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/login">
            {/* Login component*/}
            <Login />
          </Route>
          <Route path="/checkout">
            {/* Header component  */}
            <Header />
            {/* Checkout component*/}
            <Checkout />
          </Route>
          <Route path="/payment">
            {/* Header component  */}
            <Header />
            <Elements stripe = {promise}>
            {/* Payment component*/}
            <Payment />
            </Elements>
          </Route>
          <Route path="/">
            {/* Header component  */}
            <Header />
            {/* Home component*/}
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
