import React, { useMemo } from "react";

import { Booking, BookSegmentInfo } from "../appTypes";
import { BookingSegment } from "../booking-segment/BookingSegment";
import { getMinutesDiff, getTimelineDatesRange, isSameDate } from "../helpers";
import "./bookingTimeline.css";

interface BookingTimeLineProps {
  existedBookings: Booking[];
  uploadedBookings: Booking[];
}

export const BookingTimeline = ({
  existedBookings,
  uploadedBookings,
}: BookingTimeLineProps): JSX.Element => {
  const timelineDatesRange = useMemo(
    () => getTimelineDatesRange(existedBookings, uploadedBookings),
    [existedBookings, uploadedBookings]
  );

  return timelineDatesRange.length > 0 ? (
    <div className="App-booking-timeline">
      {timelineDatesRange.map((lineDate, index) => {
        const existingTodayBookings: BookSegmentInfo[] = existedBookings
          .filter((booking) => isSameDate(lineDate, new Date(booking.time)))
          .map((todayBooking) => {
            const startDate = new Date(todayBooking.time);
            const endDate = new Date(
              startDate.getTime() + todayBooking.duration
            );
            return {
              bookingInfo: todayBooking,
              startDate,
              endDate,
              toMidnightDiff: getMinutesDiff(
                new Date(todayBooking.time),
                lineDate
              ),
            };
          });
        const uploadedTodayBooks: BookSegmentInfo[] = uploadedBookings
          .filter((booking) => isSameDate(lineDate, new Date(booking.time)))
          .map((todayBooking) => {
            const startDate = new Date(todayBooking.time);
            const endDate = new Date(
              startDate.getTime() + todayBooking.duration
            );
            const isOverLapped = !!existingTodayBookings.find(
              (bookingSegment) => {
                return (
                  bookingSegment.startDate.getTime() < endDate.getTime() &&
                  bookingSegment.endDate.getTime() > startDate.getTime() &&
                  bookingSegment.bookingInfo.userId === todayBooking.userId
                );
              }
            );
            return {
              bookingInfo: todayBooking,
              startDate,
              endDate,
              isOverLapped,
              toMidnightDiff: getMinutesDiff(
                new Date(todayBooking.time),
                lineDate
              ),
            };
          });
        return (
          <div className="App-day-segment" key={index}>
            <p className="timeline-date left">
              {lineDate.toLocaleDateString("en-AU")}
            </p>
            {existingTodayBookings.map((bookingInfo, index) => (
              <BookingSegment
                bookingSegmentInfo={bookingInfo}
                key={index}
                count={index + 1}
                direction="left"
              />
            ))}
            {uploadedTodayBooks.map((bookingInfo, index) => (
              <BookingSegment
                bookingSegmentInfo={bookingInfo}
                key={index}
                count={index + 1}
                direction="right"
              />
            ))}
            <p className="timeline-date right">
              {lineDate.toLocaleDateString("en-AU")}
            </p>
          </div>
        );
      })}
    </div>
  ) : (
    <div>No Bookings</div>
  );
};
