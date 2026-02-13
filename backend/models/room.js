import mongoose from 'mongoose';
const { model, Schema, models } = mongoose;

const roomSchema = new Schema(
  {
    roomId: { type: String, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: "users" }]
  },
  { timestamps: true }
);

export const Room = models.Room || model("Room", roomSchema);