'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import SubjectsSection from '../components/SubjectsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import PricingSection from '../components/PricingSection';
import CTASection from '../components/CTASection';
import AuthModal from '../components/AuthModal';
import Footer from '../components/Footer';
import '../globals.css';

const LandingPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [activeSubject, setActiveSubject] = useState<number>(0);
  const [scrollY, setScrollY] = useState<number>(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  const OpenPricingModal = () => {
    setIsPricingModalOpen(true);
  };
  const closePricingModal = () => {
    setIsPricingModalOpen(false);
  };

  return (
    <div className="text-gray-800 font-sans bg-white">
      <Navbar openAuthModal={openAuthModal} />
      <HeroSection isVisible={isVisible}/>
      <FeaturesSection />
      <SubjectsSection
        activeSubject={activeSubject}
        setActiveSubject={setActiveSubject}
       
      />
      <TestimonialsSection scrollY={scrollY} />
      <PricingSection OpenPricingModal={openAuthModal} />
      <CTASection />
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
      <Footer />
    </div>
  );
};

export default LandingPage;