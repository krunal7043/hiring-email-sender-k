import mongoose from "mongoose";

const EmailLogSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    sentAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.models.EmailLog || mongoose.model("EmailLog", EmailLogSchema);
