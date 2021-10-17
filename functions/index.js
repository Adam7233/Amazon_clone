const functions = require('firebase-functions');
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")('sk_test_51JhFGdHEwLBi2SUWEEw1sCvzIIRbd7VRFj3gPvYsStjU2HPcLQSNWQ5Xpy8oeY5Zzx7PYVTzp9lABXEpDBaRXaK800pBrDwsGQ')

//API

//App config
const app = express();

//Middlewares
app.use(cors({origin: true}));
app.use(express.json());

//API routes
app.get('/', (request, response) => response.status(200).send('hello world ssss'))

app.post('/payments/create', async(request, response) => {
    const total = request.query.total;

    console.log('Payment Request Recieved BOOM!!! for this amount', total)

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
    });

    //OK Created
    response.status(201).send({
        clientSecret: paymentIntent.client_secret,
    })
})

//Listen command
exports.api = functions.https.onRequest(app)

//"npm --prefix \"$RESOURCE_DIR\" run lint"