// models/Token.js
import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  scope: {
    type: String,
    required: true
  },
  tokenType: {
    type: String,
    default: 'Bearer'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
TokenSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create index for faster queries
TokenSchema.index({ userId: 1 });
TokenSchema.index({ expiryDate: 1 });

export default mongoose.models.Token || mongoose.model('Token', TokenSchema);
