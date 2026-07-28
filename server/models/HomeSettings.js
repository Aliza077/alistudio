import mongoose from 'mongoose';

const slideSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
  },
  { _id: false }
);

const megaDealsSchema = new mongoose.Schema(
  {
    festTag: { type: String, default: '6.6 MID YEAR FESTIVAL' },
    title: { type: String, default: 'MEGA DEALS' },
    discountText: { type: String, default: 'UP TO 80% OFF ON PREMIUM LUXURY FURNITURE' },
    datesLabel: { type: String, default: '5 JUNE (8PM) - 10 JUNE' },
    images: { type: [String], default: [] },
  },
  { _id: false }
);

const homeSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'default', unique: true },
    slides: { type: [slideSchema], default: [] },
    megaDeals: { type: megaDealsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default mongoose.models.HomeSettings || mongoose.model('HomeSettings', homeSettingsSchema);
