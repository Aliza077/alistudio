import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import HomeSettings from './models/HomeSettings.js';
import { seedProducts } from './data/seedProducts.js';

const DEFAULT_CATEGORIES = [
  { name: 'Popular Categories', label: 'All Designs', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&auto=format&fit=crop&q=80', sortOrder: 0 },
  { name: 'Sofas', label: 'Sofas', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&auto=format&fit=crop&q=80', sortOrder: 1 },
  { name: 'Bed', label: 'Bed', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&auto=format&fit=crop&q=80', sortOrder: 2 },
  { name: 'Dressing Table', label: 'Dressing Table', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&auto=format&fit=crop&q=80', sortOrder: 3 },
  { name: 'Chairs', label: 'Chairs', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&auto=format&fit=crop&q=80', sortOrder: 4 },
];

export async function seedDatabase() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ali.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: 'Admin Ali',
      username: 'admin',
      email: adminEmail.toLowerCase(),
      phone: '',
      password: hashed,
      image: '',
      urole: 'admin',
      isactive: true,
    });
    console.log(`Default admin created: ${adminEmail}`);
  }

  let added = 0;
  let updated = 0;
  for (const product of seedProducts) {
    const exists = await Product.findOne({ title: product.title });
    if (!exists) {
      await Product.create(product);
      added += 1;
    } else if (exists.image !== product.image) {
      exists.image = product.image;
      await exists.save();
      updated += 1;
    }
  }
  if (added > 0 || updated > 0) {
    console.log(`Products: ${added} added, ${updated} images updated (${seedProducts.length} in catalog).`);
  }

  const catCount = await Category.countDocuments();
  if (catCount === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES);
    console.log(`Seeded ${DEFAULT_CATEGORIES.length} shop categories.`);
  }

  const home = await HomeSettings.findOne({ key: 'default' });
  if (!home) {
    await HomeSettings.create({
      key: 'default',
      slides: [
        { image: '/slide1.png', title: 'Transforming Spaces', subtitle: 'Into Extraordinary Experiences' },
        { image: '/slide2.png', title: 'Minimalist Elegance', subtitle: 'Crafted For Modern Living' },
        { image: '/slide3.png', title: 'Futuristic Workspaces', subtitle: 'Designed For Absolute Focus' },
      ],
      megaDeals: {
        festTag: '6.6 MID YEAR FESTIVAL',
        title: 'MEGA DEALS',
        discountText: 'UP TO 80% OFF ON PREMIUM LUXURY FURNITURE',
        datesLabel: '5 JUNE (8PM) - 10 JUNE',
        images: [
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80',
        ],
      },
    });
    console.log('Seeded home carousel & mega deals settings.');
  }
}
