import { model, models, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String },
    provider: { type: String, required: true },

    favorites: [{ type: String }],
  },
  { timestamps: true },
);

const User = models.User || model("User", UserSchema);

export default User;
