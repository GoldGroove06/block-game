import mongoose from 'mongoose';
const { model, Schema,models } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    claimedBlocks: {type: Map}
  },
  { timestamps: true }
);

// Infer TypeScript type from schema
export const Users = models.Users || model("Users", userSchema)