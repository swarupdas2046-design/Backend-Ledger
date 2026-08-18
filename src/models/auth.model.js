import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const authSchema = new mongoose.Schema({
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
},{
    timestamps: true,
});


authSchema.pre("save",function() {
    if (!this.isModified("password")) {
        return
    }
    this.password = bcrypt.hashSync(this.password, 10)
})

authSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}


export const authModel = mongoose.model("UserAuth", authSchema);


