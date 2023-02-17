import mongoose, { Models } from "mongoose";

const UserSchema: any = new mongoose.Schema<any>(
  {
    username: {
      type: String,
      require: true,
      min: 6,
    },
    firstname: {
      type: String,
      require: true,
    },
    lastname: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    profilepic: {
      type: String,
      default: "hello",
    },
    accountnumber: {
      type: Number,
      require: true,
    },
    accountbalance: {
      type: Number,
      default: 4000,
    },
    otp: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    monthlychart: {
      chart: {},
      year: { type: Number, default: new Date().getFullYear() },
    },
  },
  {
    timestamps: true,
  }
);
const TransferSchema: any = new mongoose.Schema<any>(
  {
    userid: {
      type: String,
      require: true,
      min: 6,
    },
    reciepientaccountnumber: {
      type: Number,
      require: true,
    },
    reciepientusername: {
      require: false,
      type: String,
      default: "null",
    },
    reciepientbank: {
      type: String,
      default: "Daruz",
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    note: {
      type: String,
      default: "",
    },
    isDaruz: {
      type: Boolean,
      default: true,
    },
    charges: {
      type: Number,
      default: 0,
    },
    mode:{
      type: String,
      default:"success"
    },
    date:{
      type:String,
      default: new Date().toISOString()
    }

  },
  {
    timestamps: true,
  }
);
const NotificationSchema: any = new mongoose.Schema<any>(
  {
    userid: {
      type: String,
      require: true,
      min: 6,
    },
    text: {
      type: String,
      require: true,
    },
   isSuccess: {
      require: false,
      type: Boolean,
    },
    view:{
      required:true,
      type:Boolean,
      default:false
    },
    date: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

export const UserModel =
  mongoose.models.Users_tb || mongoose.model<Models>("Users_tb", UserSchema);
export const TransferModel =
  mongoose.models.Transactions_tb ||
  mongoose.model<Models>("Transactions_tb", TransferSchema);
export const NotificationModel =
  mongoose.models.Notifications_tb ||
  mongoose.model<Models>("Notifications_tb", NotificationSchema);
