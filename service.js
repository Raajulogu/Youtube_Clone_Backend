import jwt from "jsonwebtoken";
import { User } from "./Models/User.js";

//Generate JWT token
let generateJwtToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY);
  };

//Decode Jwt Token
const decodeJwtToken = (token) => {
    try {
      let decoded = jwt.verify(token, process.env.SECRET_KEY);
      return decoded.id;
    } catch (error) {
      console.error("Error in Jwt Decoding", error);
      return null;
    }
};

//Get Current Date
function getCurrentDate(){
     // Get current date
     let currentDate = new Date();
     // Get day, month, and year from the current date
     let day = currentDate.getDate();
     let month = currentDate.getMonth() + 1; // Note: January is 0!
     let year = currentDate.getFullYear();
     // Pad day and month with leading zeros if needed
     day = day < 10 ? "0" + day : day;
     month = month < 10 ? "0" + month : month;
     // Format the date as dd/mm/yyyy
     let date = day + "/" + month + "/" + year;
     return date;
}

//Function for Send Notification
async function SendNotification({ id, content }) {
    let user = await User.findById({ _id: id });
    let notifications = [content, ...user.notifications];
    //Send Notification
    let sendNotification = await User.findOneAndUpdate(
      { _id: id },
      { $set: { notifications: notifications } }
    );
  }

export { decodeJwtToken,getCurrentDate,SendNotification,generateJwtToken };