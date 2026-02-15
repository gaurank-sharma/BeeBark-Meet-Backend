import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { sendInviteMail } from "../utils/mailer.js";
import crypto from "crypto";
import { Meeting } from "../models/meeting.model.js";
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please Provide" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User Not Found" });
    }

    let isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      let token = crypto.randomBytes(20).toString("hex");

      user.token = token;
      await user.save();
      return res.status(httpStatus.OK).json({ token: token });
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid Username or password" });
    }
  } catch (e) {
    return res.status(500).json({ message: `Something went wrong ${e}` });
  }
};

// const register = async (req, res) => {
//   const { name, username, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res
//         .status(httpStatus.FOUND)
//         .json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       name: name,
//       username: username,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     res.status(httpStatus.CREATED).json({ message: "User Registered" });
//   } catch (e) {
//     res.json({ message: `Something went wrong ${e}` });
//   }
// };


const register = async (req, res) => {
  // CHANGE 1: Destructure email from req.body
  const { name, username, password, email } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(httpStatus.FOUND)
        .json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      username: username,
      password: hashedPassword,
      email: email, // CHANGE 2: Save the email to the database
    });

    await newUser.save();

    res.status(httpStatus.CREATED).json({ message: "User Registered" });
  } catch (e) {
    res.json({ message: `Something went wrong ${e}` });
  }
};
const getUserHistory = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token: token });
    const meetings = await Meeting.find({ user_id: user.username });
    res.json(meetings);
  } catch (e) {
    res.json({ message: `Something went wrong ${e}` });
  }
};

const addToHistory = async (req, res) => {
  const { token, meeting_code } = req.body;

  try {
    const user = await User.findOne({ token: token });

    const newMeeting = new Meeting({
      user_id: user.username,
      meetingCode: meeting_code,
    });

    await newMeeting.save();

    res.status(httpStatus.CREATED).json({ message: "Added code to history" });
  } catch (e) {
    res.json({ message: `Something went wrong ${e}` });
  }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "name email username"); // Return only necessary fields
        res.json(users);
    } catch (e) {
        res.status(500).json({ message: `Something went wrong ${e}` });
    }
}

// NEW: Schedule Meeting
const scheduleMeeting = async (req, res) => {
    const { token, meetingCode, date, invitedUsers } = req.body;

    try {
        const user = await User.findOne({ token: token });
        if (!user) return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid token" });

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meetingCode,
            date: date,
            invitedUsers: invitedUsers, // Array of emails
            isScheduled: true
        });

        await newMeeting.save();

        // Send Emails
        invitedUsers.forEach(async (email) => {
             await sendInviteMail(email, meetingCode, date);
        });

        res.status(httpStatus.CREATED).json({ message: "Meeting scheduled and emails sent." });

    } catch (e) {
        res.status(500).json({ message: `Something went wrong ${e}` });
    }
}

export { login, register, getUserHistory, addToHistory, getAllUsers, scheduleMeeting};
