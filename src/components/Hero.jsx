import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

function Hero() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login');
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Always informed. Always involved.</h1>
        <p className="hero-subtitle">
          Stay updated on every celebration, program, and important school moment.
        </p>
        <button className="hero-button" onClick={handleClick}>View events</button>
      </div>
    </section>
  );
}

export default Hero;
