import React, { useMemo, useRef, useState } from "react";
import Popover from "@mui/material/Popover";

import { BookSegmentInfo } from "../appTypes";
import "./bookingSegment.css";
import { convertMstoMin } from "../helpers";
import { BOOKING_SEGMENT_WIDTH, MINUTE_HEIGHT } from "../constants";

interface BookingSegmentProps {
  bookingSegmentInfo: BookSegmentInfo;
  count: number;
  direction: "left" | "right";
}

export const BookingSegment = ({
  bookingSegmentInfo,
  count,
  direction,
}: BookingSegmentProps): JSX.Element => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);

  return (
    <>
      <button
        className="App-booking-segment"
        style={{
          backgroundColor: bookingSegmentInfo.isOverLapped ? "red" : "green",
          top: bookingSegmentInfo.toMidnightDiff * MINUTE_HEIGHT,
          height: `${
            convertMstoMin(bookingSegmentInfo.bookingInfo.duration) *
            MINUTE_HEIGHT
          }px`,
          ...(direction === "left"
            ? {
                left: `-${BOOKING_SEGMENT_WIDTH * count}px`,
              }
            : {
                right: `-${BOOKING_SEGMENT_WIDTH * count}px`,
              }),
        }}
        ref={buttonRef}
        type="button"
        onClick={() => setIsPopOverOpen(true)}
      >
        Click me!
      </button>
      <Popover
        open={isPopOverOpen}
        anchorEl={buttonRef.current}
        onClose={() => setIsPopOverOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <p>User: {bookingSegmentInfo.bookingInfo.userId}</p>
        <p>
          Reservation Time:{" "}
          {bookingSegmentInfo.startDate.toLocaleString("en-AU")} to{" "}
          {bookingSegmentInfo.endDate.toLocaleString("en-AU")}
        </p>
      </Popover>
    </>
  );
};
