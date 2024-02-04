// importing moment for changing the date format
import moment from "moment";

export const getAntdFormInputRules = [
  {
    required: true,
    message: "Required",
  },
];

//setting the date format
export const getDateFormat = (date) => {
  return moment(date).format("MMMM Do YYYY, h:mm A");
};
