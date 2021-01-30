if (process.env.NODE_ENV != 'production'){
    require('dotenv').config({path:'./.env'})
}

const StripeSecretKey = process.env.STRIPE_SECRET_KEY
const express=require('express');
const  app = express();
app.set('view engine', 'ejs') //view engine set to ejs
app.use(express.static('public'));
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));


app.get("/",(req,res)=>{
    res.render('donate.ejs')
})


app.post('/', async (req, res) => {
    // TO ADD: data validation, storing errors in an `errors` variable!
    console.log(req.body)
    const name = req.body.name;
    const email = req.body.email;
    const amount = req.body.amount;
    if (true) { // Data is valid!
      try {
        // Create a PI:
        const stripe = require('stripe')(StripeSecretKey);
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount *100, 
          currency: 'inr',
          receipt_email: email,
          description:"Donation",
        });
        res.render('Card', {name: name, amount: amount, intentSecret: paymentIntent.client_secret });
      } catch(err) {
        console.log('Error! ', err.message);
      }

    } 
    else {
      res.render('donate', { title: 'Donate', errors: errors });
      }
});


app.post('/thanks', (req, res)=> {
  res.render('Thanks', { title: 'Thanks!' });
});


app.listen(2000, ()=>{
    console.log("server started");
})
