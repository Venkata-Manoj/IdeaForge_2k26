// Admin model for admins collection
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  passwordHash: {
    type: String,
    required: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

export default Admin;