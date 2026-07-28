import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: String,
    price: Number,
    quantity: Number,
    image: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: { type: String, required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: String, default: '' },
    cardHolder: { type: String, default: '' },
    cardNumberLast4: { type: String, default: '' },
    paymentMethod: { type: String, default: 'Cash on Delivery' },
    paymentStatus: { type: String, default: 'Pending' },
    trackingId: { type: String, required: true, unique: true },
    status: { type: String, default: 'confirmed' },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
