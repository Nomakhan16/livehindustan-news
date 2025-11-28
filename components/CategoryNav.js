import { useState } from 'react';

const categories = [
  'Latest',
  'National',
  'Politics', 
  'Business',
  'Sports',
  'Entertainment',
  'Technology',
  'World',
  'Health',
  'Science'
];

export default function CategoryNav() {
  const [activeCategory, setActiveCategory] = useState('Latest');

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex space-x-1 py-3 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? 'bg-red-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}