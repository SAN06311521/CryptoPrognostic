const sgMail = require("@sendgrid/mail");
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const fetch = require("node-fetch");
const user = require("../models/user");
const mailgun = require("mailgun-js");

var cron = require("node-cron");

cron.schedule("* 1 * * * *", () => {
  console.log("donedonadone");

  checking();
});
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

function sendmail(user, el) {
  const DOMAIN = "sandboxe0dc066c7e834f0e9433ea2aba0e7cd4.mailgun.org";
  const mg = mailgun({
    apiKey: "bef889241e65942e29d8da6c1eaed0d0-7b8c9ba8-605abc76",
    domain: DOMAIN,
  });
  const data = {
    to: user.email, // Change to your recipient
    from: "cryptoprognostic@gmail.com", // Change to your verified sender
    subject: "The Crypto Alert is here!!!",
    text: `Hey ${user.firstName}!
        Dropping this mail to remind you that your Alert is live now!!
        The form submission by you on our site, Crypto Prognostic, was successful. Here is the ALERT mail which says - the price of ${user.cryptoCoin} has reached ${user.criticalValuePrice} and it's current price, now, is ${el.current_price}.
        Our heartiest thanksgiving, for visiting our website and trusting our Alert feature! We are promising to maintain our service always available for you. 
        You can set another alert by visiting our site any time! We will be pleased to help you.
        
        Best Regards,
        Crypto Prognostic Team.
        
        You can unsubscribe your alerts from Crypto Prognostic if you wish to!`,
  };
  mg.messages().send(data, function (error, body) {
    console.log(body);
    console.log("Email sent");
    console.log("sent to", user.email);
  });
}

// function sendmail(user,el){
//     const msg = {
//         to: user.email, // Change to your recipient
//         from: 'cryptoprognostic@gmail.com', // Change to your verified sender
//         subject: 'The Crypto Alert is here!!!',
//         text: `Hey ${user.firstName}!
//         Dropping this mail to remind you that your Alert is live now!!
//         The form submission by you on our site, Crypto Prognostic, was successful. Here is the ALERT mail which says - the price of ${user.cryptoCoin} has reached ${user.criticalValuePrice} and it's current price, now, is ${el.current_price}.
//         Our heartiest thanksgiving, for visiting our website and trusting our Alert feature! We are promising to maintain our service always available for you.
//         You can set another alert by visiting our site any time! We will be pleased to help you.

//         Best Regards,
//         Crypto Prognostic Team.

//         You can unsubscribe your alerts from Crypto Prognostic if you wish to!`,
//     }
//     sgMail
//         .send(msg)
//         .then(() => {
//             console.log('Email sent');
//             console.log('sent to', user.email);
//         })
//         .catch((error) => {
//             console.error(error)
//     })

// }

async function checking() {
  let finalArray = [];
  try {
    const users = await User.find();
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=false"
      );
      const responseData = await response.json();
      finalArray = [...responseData];
      for (let index = 1; index < users.length; index++) {
        const user = users[index];
        for (let j = 0; j < finalArray.length; j++) {
          const element = finalArray[j];
          if (user.cryptoCoin === element.id) {
            if (user.price != "") {
              if (user.price === "above") {
                if (
                  parseInt(user.criticalValuePrice) <= element.current_price
                ) {
                  sendmail(user, element);
                }
              } else {
                if (
                  parseInt(user.criticalValuePrice) >= element.current_price
                ) {
                  sendmail(user, element);
                  console.log("done");
                }
              }
            } else {
              if (user.percentage === "above") {
                if (
                  parseInt(user.criticalValuePercent) <=
                  element.price_change_percentage_24h
                ) {
                  sendmail(user, element);
                  console.log("done");
                }
              } else {
                if (
                  parseInt(user.criticalValuePercent) >=
                  element.price_change_percentage_24h
                ) {
                  sendmail(user, element);
                  console.log("done");
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
      // res.send(error)
    }
    // console.log(users);
  } catch (err) {
    console.log(err);
  }
}

router.get("/:emailId", async (req, res) => {
  try {
    const data = await User.find({ email: req.params.emailId }).exec();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.send("Error " + err);
  }
});

router.post("/", async (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    cryptoCoin: req.body.cryptoCoin,
    price: req.body.price,
    criticalValuePrice: req.body.criticalValuePrice,
    percentage: req.body.percentage,
    criticalValuePercent: req.body.criticalValuePercent,
  });

  try {
    const a1 = await user.save();
    res.json(a1);
  } catch (err) {
    console.log(err);
    res.send("Error");
  }
});
router.post("/unsubscribe", async (req, res) => {
  const arrays = req.body.choices;
  for (let index = 0; index < arrays.length; index++) {
    const element = arrays[index];
    await User.deleteOne({ _id: element });
  }
  res.send("success");
});

module.exports = router;
