const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const jsonParser = bodyParser.json();
const app = express();
app.use(cors()); // so that app can access

app.get("/bookings", (_, res) => {
  const bookings = JSON.parse(fs.readFileSync("./server/bookings.json")).map(
    (bookingRecord) => ({
      time: Date.parse(bookingRecord.time),
      duration: bookingRecord.duration * 60 * 1000, // mins into ms
      userId: bookingRecord.user_id,
    })
  );
  res.json(bookings);
});

app.post("/bookings", jsonParser, (req, res) => {
  const newUploadBookings = req.body.newUploadBookings;
  fs.readFile("./server/bookings.json", function (err, data) {
    const existedArr = JSON.parse(data);
    const updatedArr = existedArr.concat(
      newUploadBookings.map((booking) => {
        return {
          time: new Date(booking.time).toUTCString(),
          duration: booking.duration / 1000 / 60,
          user_id: booking.userId,
        };
      })
    );
    fs.writeFile(
      "./server/bookings.json",
      JSON.stringify(updatedArr),
      function (err) {
        if (err) throw err;
        res.status(200).send(
          updatedArr.map((bookingRecord) => ({
            time: Date.parse(bookingRecord.time),
            duration: bookingRecord.duration * 60 * 1000, // mins into ms
            userId: bookingRecord.user_id,
          }))
        );
      }
    );
  });
});

app.listen(3001);
