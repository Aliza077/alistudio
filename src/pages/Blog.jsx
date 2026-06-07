import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock } from 'lucide-react';
import StudioPageLayout from '../components/StudioPageLayout';

const posts = [
  { title: 'The Rise of Minimalist Japandi Decor', date: 'June 01, 2026', readTime: '5 min read', category: 'Trends', desc: 'Discover how Japanese zen elements combine with Scandinavian comfort in modern furniture design. Learn which pieces work best for small apartments.' },
  { title: 'Choosing the Perfect Lighting for Modern Spaces', date: 'May 20, 2026', readTime: '7 min read', category: 'Guides', desc: 'A comprehensive guide to pendant lamps, floor lighting, and ambient glow — how to layer light for warmth and focus in any room.' },
  { title: 'Sourcing Sustainably Fabricated Woods', date: 'April 14, 2026', readTime: '4 min read', category: 'Sustainability', desc: 'Understanding FSC certifications, carbon footprints, and why solid wood furniture lasts generations compared to particle board alternatives.' },
  { title: '2026 Color Trends in Luxury Furniture', date: 'March 28, 2026', readTime: '6 min read', category: 'Trends', desc: 'Deep teal, warm terracotta, and muted sage are dominating this year. See how to incorporate trending colors without overwhelming your space.' },
  { title: 'Small Space, Big Style: Apartment Furniture Tips', date: 'March 10, 2026', readTime: '5 min read', category: 'Tips', desc: 'Multi-functional furniture, vertical storage solutions, and mirror tricks to make compact spaces feel expansive and luxurious.' },
];

export default function Blog() {
  return (
    <StudioPageLayout maxWidth="900px">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <span className="place-node-badge">Latest Insights</span>
        <h1 className="studio-page-title font-serif">Design Blog</h1>
        <p className="studio-page-lead">Expert articles on furniture trends, interior design tips, and sustainable living.</p>
        <div className="studio-blog-list">
          {posts.map((post, idx) => (
            <motion.article
              key={idx}
              className="place-grid-card glass studio-blog-card"
              whileHover={{ y: -3 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <div className="studio-blog-meta">
                <span className="studio-blog-cat">{post.category}</span>
                <span className="studio-blog-date">{post.date}</span>
                <span className="studio-blog-read"><Clock size={12} /> {post.readTime}</span>
              </div>
              <h2>{post.title}</h2>
              <p>{post.desc}</p>
              <span className="studio-blog-read-more"><BookOpen size={14} /> Read Article</span>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </StudioPageLayout>
  );
}
