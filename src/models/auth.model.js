import mongoose from "mongoose";
import bcrypt from "bcrypt";

const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [3, "Name must be at least 3 characters long."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long."],
    },

    systemUser:{
        type:Boolean,
        default:false,
        immutable:true,
        select:false
    },

    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Hash the password before saving the user document

authSchema.pre("save", function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = bcrypt.hashSync(this.password, 10);
});

// Compare the provided password with the hashed password in the database

authSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Create and export the UserAuth model based on the authSchema
const authModel = mongoose.model("UserAuth", authSchema);

export default authModel;
