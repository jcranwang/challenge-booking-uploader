import { Booking } from "./appTypes";

export const getDatesInRange = (
  startTimeStamp: number,
  endTimeStamp: number
): Date[] => {
  const startDate = new Date(startTimeStamp);
  const endDate = new Date(endTimeStamp);
  const date = new Date(startDate.getTime());
  const dates = [];
  while (date <= endDate) {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    dates.push(newDate);
    date.setDate(date.getDate() + 1);
  }
  return dates;
};

export const getTimelineDatesRange = (
  existedBookings: Booking[],
  uploadedBookings: Booking[]
) => {
  let timelineDatesRange: Date[] = [];
  if (existedBookings.length > 0 || uploadedBookings.length > 0) {
    const allBookings = existedBookings.concat(uploadedBookings);
    allBookings.sort((a, b) => {
      const dateA = new Date(a.time);
      const dateB = new Date(b.time);
      return dateA.getTime() - dateB.getTime();
    });
    timelineDatesRange = getDatesInRange(
      allBookings[0].time,
      allBookings[allBookings.length - 1].time
    );
  }
  return timelineDatesRange;
};

export const isSameDate = (dateA: Date, dateB: Date) => {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};

export const getMinutesDiff = (dateA: Date, dateB: Date) => {
  let timeDiff = (dateB.getTime() - dateA.getTime()) / 1000 / 60;
  return Math.abs(Math.round(timeDiff));
};

export const convertMstoMin = (milliSeconds: number) =>
  milliSeconds / 1000 / 60;
