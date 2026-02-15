// import mongoose, { Schema } from "mongoose";

// const userScheme = new Schema({
//   name: { type: String, required: true },
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   token: { type: String },
// });

// const User = mongoose.model("User", userScheme);

// export { User };


import mongoose, { Schema } from "mongoose";

const userScheme = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String },
  email: { type: String, required: true, unique: true } // Added email
});

const User = mongoose.model("User", userScheme);
export { User };