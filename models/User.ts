import { model, models, Schema } from "mongoose";

const FavoriteMovieSchema = new Schema({
  movieId: { type: String, required: true },
  title: { type: String, required: true },
  poster_path: { type: String },
  genres:[
    {
      id: { type: Number },
      name: { type: String }
    }
  ],
  addedAt: { type: Date, default: Date.now },
})

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String },
    provider: { type: String, required: true },

    favorites: [FavoriteMovieSchema],
  },
  { timestamps: true },
);

const User = models.User || model("User", UserSchema);

export default User;
