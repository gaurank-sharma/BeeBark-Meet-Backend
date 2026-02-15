// import mongoose, { Schema } from "mongoose";

// const meetingSchema = new Schema({
//   user_id: { type: String },
//   meetingCode: { type: String, required: true },
//   date: { type: Date, default: Date.now, required: true },
// });

// const Meeting = mongoose.model("Meeting", meetingSchema);

// export { Meeting };


import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema({
  user_id: { type: String }, // The host
  meetingCode: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  invitedUsers: [{ type: String }], // Array of user_ids or emails
  isScheduled: { type: Boolean, default: false }
});

const Meeting = mongoose.model("Meeting", meetingSchema);
export { Meeting };