import { model, Schema } from 'mongoose';

const userSchema = new Schema({
  email: {
    required: true,
    type: String,
  },
  googleId: {
    required: true,
    type: String,
  },
  username: {
    required: true,
    type: String,
  },
}, {
  timestamps: true,
  versionKey: false,
});

export default model('User', userSchema);
