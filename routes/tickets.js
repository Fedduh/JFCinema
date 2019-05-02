const express = require('express');
const router = express.Router();
const Cinema = require('../models/cinema')
const Screening = require('../models/screening');
const nodemailer = require('nodemailer');
const templates = require('../templates/template');

router.get('/confirmation', (req, res, next) => {
  res.render('tickets/confirmation')
});

router.get('/:id', (req, res, next) => {
  Screening.findOne({
      _id: req.params.id
    })
    .populate('movieID')
    .populate('cinemaID')
    .then(screening => {
      res.render('tickets/ticket-selection_sp', screening)

    })
    .catch(error => error)
});

//added to get only data for javacripts/ticket-reservation.js
router.get('/:id/data', (req, res, next) => {
  Screening.findOne({
      _id: req.params.id
    })
    .populate('movieID')
    .populate('cinemaID')
    .then(screening => {
      res.send(screening)
    })
    .catch(error => error)
});



router.post("/:id/data", (req, res, next) => {

  const reqArr = req.body.reservation.map(reservation => {
    Screening.findOne({
        _id: req.params.id,

      })
      .then(screening => screening.seatPlan.find(seat => seat.row == reservation.row && seat.seatNo == reservation.seatNo))
      .then(seat => {
        return seat._id
      })
      .then(seatRef => Screening.findOneAndUpdate({
        _id: req.params.id,
        'seatPlan._id': seatRef
      }, {
        $set: {
          'seatPlan.$.available': false,
          'seatPlan.$.userID': req.user
        }
      }))
    return new Promise((resolve, reject) => {
      resolve("updated"); // fulfilled
      reject("failure"); // rejected
    });
  })

  Promise.all(reqArr)
 // .then(()=>res.render('tickets/confirmation'))
    .then((result) => {
      let messageSeats = "";
      for (var i = 0; i < req.body.reservation.length; i++) {
        messageSeats += `Seat:${req.body.reservation[i].seatNo} in Row: ${req.body.reservation[i].row} <br/>`
      }


      let subject = `Reservation for ${req.user.username} in JFCinema - ${req.body.screening.movieID.title}`

      //console.log(subject)
      let imgUrl = req.body.screening.movieID.imageUrl;

      let message = 
      `<h2>Dear ${req.user.username} </h2>
      <p>thanks for your reservation</p><br/>
      <p>Here is your reservation :</p>
      <div>
      ${messageSeats}
      </div>`
      console.log(message);
      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'JFCinema2019',
          pass: process.env.GMAIL_PASS
        }
      });
      transporter.sendMail({
        from: '"JF Cinema - movie reservation 👻" <JFCinema2019@gmail.com>',
        to: req.user.email,
        subject: subject,
        text: message,
        html: templates.templateExample(message, imgUrl)
      }, (error, info) => {
        if (error) {
          res.send("error")
        } else {
          res.send("ok")
          // res.render('tickets/confirmation')
          console.log("e-mail is sent")
        }
      })

   })
})






module.exports = router;