"use client";

import { useState, useEffect } from "react";
// import { ArrowUp } from "lucide-react"; // Если используешь lucide-react (рекомендую)
// Или можно использовать SVG вручную, если нет lucide

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Показывать кнопку после прокрутки на 400px вниз
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 1000) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Плавная прокрутка наверх
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="
            fixed bottom-8 right-8 
            z-50 
            bg-[#1E79AD] hover:bg-[#145073] 
            text-white 
            p-4 rounded-full 
            shadow-2xl 
            transition-all duration-300 
            hover:scale-110 
            focus:outline-none focus:ring-4 focus:ring-[#1E79AD]/50
          "
          aria-label="Прокрутить наверх"
        >
          {/* Иконка из lucide-react */}
          {/* <ArrowUp size={28} strokeWidth={2.5} /> */}

          {/* Если нет lucide-react — альтернатива на SVG */}
        
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
          
        </button>
      )}
    </>
  );
}