import * as mongoose from 'mongoose';

export const FileSchema = new mongoose.Schema({
  fileName: String,
  url: String,
  mime: String,
  size: Number,
  encKey: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
}, {
  timestamps: true
});
