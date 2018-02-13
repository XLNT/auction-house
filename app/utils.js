import moment from "moment";

export const getEndDate = (startedAt, duration) => {
  const startDate = moment.unix(startedAt);
  const endDate = startDate.add(duration, "seconds");
  return endDate.toDate();
};
