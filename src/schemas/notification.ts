import { Schema } from "mongoose";

export let notificationSchema: Schema = new Schema({
  secret: {
    recipient: {
      type: String,
      required: true
    },
    from: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});
