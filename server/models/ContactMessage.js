import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    type: { type: String, default: 'General Inquiry' },
    message: { type: String, required: true, trim: true },
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);
