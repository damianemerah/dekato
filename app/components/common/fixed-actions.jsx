'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp, MessageCircle } from 'lucide-react'; // Assuming you have lucide-react for icons
import { Button } from '@/app/components/ui/button';
import { bizInfo } from '@/app/resources/contents'; // Import bizInfo

const FixedActions = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChatClick = () => {
    window.open(
      `https://wa.me/${bizInfo.whatsapp.replace(/[^0-9]/g, '')}`,
      '_blank'
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-center space-y-3">
      {showScrollToTop && (
        <Button
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      )}
      <Button
        size="icon"
        className="h-12 w-12 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600"
        onClick={handleChatClick}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default FixedActions;
