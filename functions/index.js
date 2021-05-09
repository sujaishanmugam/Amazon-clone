const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { request } = require("express");
const { response } = require("express");
const stripe = require("stripe")(
  "sk_test_51IkP0SSEqTd6aS601XmEolHIMtLkWGsCsNMrUV8sAcsshNvbKaTCFO5z5ZyotDf56O5E8rHIbTZSlVxC3lTAe6eL00NfNrMVnx"
);

//api

// app configstore
const app = express();

// middlewares
app.use(cors({ origin: true }));
app.use(express.json()); // to send and pass data
// API routes
app.get("/", (request, response) => response.status(200).send("hello World"));

app.post("/payments/create", async(request,response) => {
  const total = request.query.total;

  console.log('Payment request recieved',total)

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "rupees"
  })

  response.status(201).send({
    clientSecret: paymentIntent.clientSecret,
  })
})

// listen command
exports.api = functions.https.onRequest(app);


// example endpoint

// (http://localhost:5001/clone-ed7af/us-central1/api).