import React from 'react';
import SiteNavbar from './SiteNavbar';
import SiteFooter from './SiteFooter';

export default function StudioPageLayout({ children, maxWidth = '1000px' }) {
  return (
    <div className="place-container studio-layout-with-nav home-like-nav">
      <div className="place-glow-top" />
      <div className="place-glow-bottom" />

      <SiteNavbar variant="overlay" />

      <main className="place-main studio-page-main" style={{ maxWidth }}>
        {children}
      </main>

      <SiteFooter compact />
    </div>
  );
}
