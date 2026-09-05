// src/components/VideoBackground.jsx
import React, { useState } from 'react';

export default function VideoBackground() {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <div className="bg-video-container bg-black">
      {/* Fallback & Ambient Layer */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${videoLoaded ? 'opacity-30' : 'opacity-100'}`}
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 100%, rgba(88, 28, 48, 0.35) 0%, rgba(30, 10, 20, 0.6) 40%, rgba(0, 0, 0, 0.95) 80%),
            radial-gradient(circle at 50% 20%, rgba(20, 24, 35, 0.6) 0%, rgba(5, 5, 8, 1) 100%)
          `
        }}
      >
        {/* Subtle digital matrix particle effect grid for ambient depth */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        ></div>
      </div>

      {/* Primary Video Layer with High Visual Fidelity */}
      <video 
        className="bg-video opacity-85 object-cover" 
        autoPlay 
        muted 
        loop 
        playsInline
        onLoadedData={() => setVideoLoaded(true)}
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4"
          type="video/mp4"
        />
      </video>

      {/* Subtle Cinematic Vignette to keep text ultra-crisp while maintaining wave vibrancy */}
      <div className="bg-overlay bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.15)_0%,_rgba(0,0,0,0.45)_65%,_rgba(0,0,0,0.8)_100%)]"></div>
    </div>
  );
}
