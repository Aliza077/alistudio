import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Palette, Wrench, Layers, Truck, Ruler } from 'lucide-react';
import StudioPageLayout from '../components/StudioPageLayout';

const services = [
  { icon: Compass, title: 'Spatial Architecture Planning', desc: 'Detailed blueprint modeling of layout grids for living zones, offices, and commercial spaces. We analyze traffic flow, natural light, and functional zones before recommending furniture placement.', price: 'From $299/room' },
  { icon: Palette, title: 'Color Palette Curation', desc: 'Harmonizing textures, materials, and paint tones for a cohesive luxury feel. Our designers create mood boards tailored to your aesthetic — modern, classic, or eclectic.', price: 'From $199' },
  { icon: Wrench, title: 'Custom Furniture Fabrication', desc: 'Bespoke design and crafting of tables, couches, cabinetry, and wardrobes unique to your dimensions and material preferences.', price: 'Custom quote' },
  { icon: Layers, title: 'B2B Commercial Consultation', desc: 'Optimizing corporate spaces for productivity and brand identity. We handle reception areas, meeting rooms, and executive suites.', price: 'From $1,499' },
  { icon: Truck, title: 'White-Glove Delivery & Assembly', desc: 'Professional delivery, unpacking, placement, and assembly of all furniture items. Available on orders over $500.', price: 'Free over $500' },
  { icon: Ruler, title: 'Virtual Room Styling', desc: '3D visualization of your space with our furniture before purchase. See exactly how pieces will look in your home.', price: 'From $99' },
];

export default function Services() {
  return (
    <StudioPageLayout maxWidth="900px">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <span className="place-node-badge">Bespoke Services</span>
        <h1 className="studio-page-title font-serif">Our Services</h1>
        <p className="studio-page-lead">From concept to installation — comprehensive design and furniture services for every space.</p>
        <div className="studio-services-list">
          {services.map((serv, idx) => (
            <motion.div
              key={idx}
              className="place-grid-card glass studio-service-card"
              whileHover={{ y: -3 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <div className="place-card-icon-wrapper studio-icon-blue">
                <serv.icon size={22} style={{ color: 'var(--accent-blue)' }} />
              </div>
              <div className="studio-service-content">
                <div className="studio-service-top">
                  <h4>{serv.title}</h4>
                  <span className="studio-service-price">{serv.price}</span>
                </div>
                <p>{serv.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </StudioPageLayout>
  );
}
