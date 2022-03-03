import React, { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import Papa from "papaparse";

import "./App.css";
import { Booking } from "./appTypes";
import { BookingTimeline } from "./booking-timeline/BookingTimeline";

const apiUrl = "http://localhost:3001";

export const App = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [uploadedBookings, setUploadedBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetch(`${apiUrl}/bookings`)
      .then((response) => response.json())
      .then(setBookings);
  }, []);

  const onDrop = (files: File[]) => {
    if (files.length > 0) {
      Papa.parse<string>(files[0], {
        complete: (results) => {
          const uploadedBookingData = results.data.slice(1);
          const uploadedBookingArr = uploadedBookingData
            .filter((booking) => booking.length === 3)
            .map((booking) => {
              return {
                time: Date.parse(booking[0].trim()),
                duration: parseInt(booking[1].trim()) * 60 * 1000,
                userId: booking[2].trim(),
              };
            });
          setUploadedBookings(uploadedBookingArr);
        },
      });
    }
  };

  const onUploadBookings = (
    newBookings: Booking[],
    existedBookings: Booking[]
  ) => {
    if (newBookings.length > 0) {
      const notOverlappedBookings = newBookings.filter((newBooking) => {
        const startDate = new Date(newBooking.time);
        const endDate = new Date(startDate.getTime() + newBooking.duration);
        const overlappedBookings = existedBookings.find((existedBooking) => {
          const existedBookingStartDate = new Date(existedBooking.time);
          const existedBookingEndDate = new Date(
            existedBookingStartDate.getTime() + existedBooking.duration
          );
          return (
            existedBookingStartDate.getTime() < endDate.getTime() &&
            existedBookingEndDate.getTime() > startDate.getTime() &&
            existedBooking.userId === newBooking.userId
          );
        });
        return overlappedBookings === undefined;
      });
      if (notOverlappedBookings.length > 0) {
        fetch(`${apiUrl}/bookings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newUploadBookings: notOverlappedBookings,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            setBookings(data);
            setUploadedBookings([]);
          });
      } else {
        alert("All uploaded bookings are overlapped with existing ones");
      }
    }
  };

  return (
    <div className="App">
      <div className="App-header">
        <Dropzone accept=".csv" onDrop={onDrop}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </Dropzone>
      </div>
      <div className="App-main">
        <div className="App-sections">
          <div>
            <h2>Existing bookings</h2>
          </div>
          <div className="timeline-legend">
            <div className="not-overlap-legend">Green - Not overlapped</div>
            <div className="overlap-legend">Red - Overlapped</div>
          </div>
          <div>
            <h2>Uploaded bookings</h2>
            <button
              className="upload-button"
              type="button"
              disabled={uploadedBookings.length === 0}
              onClick={() => onUploadBookings(uploadedBookings, bookings)}
            >
              Upload
            </button>
          </div>
        </div>
        <BookingTimeline
          existedBookings={bookings}
          uploadedBookings={uploadedBookings}
        />
      </div>
    </div>
  );
};
