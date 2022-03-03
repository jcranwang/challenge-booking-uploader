export type TimeStamp = number;
export type Seconds = number;
export type Booking = {
  time: TimeStamp;
  duration: Seconds;
  userId: string;
};
export type BookSegmentInfo = {
  bookingInfo: Booking;
  startDate: Date;
  endDate: Date;
  toMidnightDiff: number;
  isOverLapped?: boolean;
};
