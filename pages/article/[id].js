// pages/article/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getNewsArticleById } from '../../utils/newsAPI';

export default function ArticlePage() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 FIX: Handle broken images
  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop';
    e.target.onerror = null;
  };

  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        try {
          setLoading(true);
          const articleData = await getNewsArticleById(id);
          setArticle(articleData);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching article:', error);
          setLoading(false);
        }
      };
      fetchArticle();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">Article not found!</div>
        <button 
          onClick={() => router.push('/')}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {article.title || `Article ${id}`}
        </h1>
        
        <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
          <span>
            <strong>Published:</strong> {new Date(article.publishedAt).toLocaleDateString()}
          </span>
          {article.author && (
            <span>
              <strong>Author:</strong> {article.author}
            </span>
          )}
          {article.source?.name && (
            <span>
              <strong>Source:</strong> {article.source.name}
            </span>
          )}
        </div>
        
        {/* 🔥 FIXED IMAGE WITH ERROR HANDLING */}
        {article.urlToImage && (
          <div className="mb-6">
            <img 
              src={article.urlToImage} 
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg"
              onError={handleImageError}
            />
          </div>
        )}
        
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed text-lg mb-6">
            {article.description}
          </p>
          
          {article.content && (
            <div className="mt-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {article.content}
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button 
            onClick={() => router.back()}
            className="bg-blubg-red-100 hover:bg-red-200 text-red-700 px-6 py-3 rounded-lg transition-colors duration-200 font-medium border border-red-200 hover:border-red-300 flex items-center space-x-2-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            ← Back 
          </button>
        </div>
      </article>
    </div>
  );
}