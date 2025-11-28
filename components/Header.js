import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [currentDate, setCurrentDate] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));

    // Scroll effect for header
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`glass-header sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-lg py-2' : 'shadow-sm py-4'
    }`}>
      <div className="container-custom">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg">
              <span className="text-white font-bold text-lg">LH</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-red-600 bg-clip-text text-transparent">
              LiveHindustan
            </span>
          </Link>

          {/* Date and Weather */}
          <div className="text-right fade-in">
            <div className="text-sm text-gray-600 font-medium">
              {currentDate || 'Loading...'}
            </div>
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block mt-1">
              🌤️ Lucknow, 25°C
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-gray-200/50 pt-3">
          <ul className="flex space-x-6 py-2 overflow-x-auto scrollbar-creative">
            {['Latest', 'National', 'Politics', 'Business', 'Sports', 'Entertainment', 'Technology', 'World'].map((category) => (
              <li key={category}>
                <Link 
                  href={`/#${category.toLowerCase()}`}
                  className="text-sm font-semibold text-gray-700 hover:text-red-600 whitespace-nowrap transition-all duration-300 hover:scale-105 relative group"
                >
                  {category}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}