// components/NewsCard.js
import Link from 'next/link';

export default function NewsCard({ article }) {
  const articleId = article.title
    ?.toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50) || 'article';

  // 🔥 FIX: Handle broken images
  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop';
    e.target.onerror = null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      {/* 🔥 FIXED IMAGE WITH ERROR HANDLING */}
      <div className="relative h-48 w-full">
        <img
          src={article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop'}
          alt={article.title || 'News article'}
          className="w-full h-48 object-cover"
          onError={handleImageError}
        />
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {article.source?.name || 'News Source'}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(article.publishedAt).toLocaleDateString()}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 flex-grow">
          {article.title || 'No title available'}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
          {article.description || 'No description available...'}
        </p>

        {article.author && (
          <p className="text-sm text-gray-500 mb-4">
            By {article.author}
          </p>
        )}

        <Link 
          href={`/article/${articleId}`}
          className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors duration-200 text-center mt-auto font-medium border border-red-200 hover:border-red-300"
        >
          Read Full Article
        </Link>
      </div>
    </div>
  );
}