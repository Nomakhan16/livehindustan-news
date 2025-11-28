// pages/index.js
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import NewsGrid from '../components/NewsGrid';
import CategoryNav from '../components/CategoryNav';
import Footer from '../components/Footer';
import { getAllNews, forceRefreshNews } from '../utils/newsAPI';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');
  const [activeCategory, setActiveCategory] = useState('general');

  const loadNews = async (category = 'general') => {
    try {
      setLoading(true);
      setError(null);
      console.log(`📰 Loading ${category} news...`);
      
      const newsData = await getAllNews(category, 20);
      
      if (newsData && newsData.length > 0) {
        setArticles(newsData);
        setLastUpdated(new Date().toLocaleTimeString());
        
        // ✅ SAVE ARTICLES FOR ARTICLE PAGE ACCESS
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentNewsArticles', JSON.stringify(newsData));
          console.log('💾 Articles saved to localStorage for article page');
        }
        
        console.log(`✅ Loaded ${newsData.length} ${category} articles`);
      } else {
        throw new Error('No articles received');
      }
    } catch (err) {
      console.error('❌ Error loading news:', err);
      setError('Failed to load news. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category.toLowerCase());
    loadNews(category.toLowerCase());
  };

  const handleManualRefresh = async () => {
    console.log('🔄 Manual refresh requested');
    const freshData = await forceRefreshNews();
    if (freshData) {
      setArticles(freshData);
      setLastUpdated(new Date().toLocaleTimeString());
      
      // Save to localStorage for article page
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentNewsArticles', JSON.stringify(freshData));
      }
    }
  };

  useEffect(() => {
    // Load initial news
    loadNews('general');
  }, []);

  // Get featured article for hero section
  const featuredArticle = articles.length > 0 ? articles[0] : null;

  return (
    <>
      <Head>
        <title>LiveHindustan - Latest News & Breaking Updates</title>
        <meta name="description" content="Stay updated with the latest news, breaking stories, and in-depth coverage from India and around the world. LiveHindustan brings you real-time news updates." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <CategoryNav onCategoryChange={handleCategoryChange} activeCategory={activeCategory} />
        
        <main className="flex-grow">
          {/* Simple Status Bar */}
          <div className="bg-white border-b border-gray-200">
            <div className="container-custom">
              <div className="flex flex-col sm:flex-row justify-between items-center py-3 text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <span className="font-medium">
                    📰 Live News • {articles.length} articles
                  </span>
                  {lastUpdated && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      Updated: {lastUpdated}
                    </span>
                  )}
                </div>
                
                <button 
                  onClick={handleManualRefresh}
                  disabled={loading}
                  className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors duration-200 font-medium border border-red-200 hover:border-red-300 flex items-center space-x-2 mt-2 sm:mt-0"
                >
                  <span>🔄</span>
                  <span>{loading ? 'Refreshing...' : 'Refresh News'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && articles.length === 0 && (
            <div className="container-custom py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
                <p className="text-gray-600">Loading latest news...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="container-custom py-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-red-600 text-lg mb-2">⚠️ Unable to Load News</div>
                <p className="text-red-700 mb-4">{error}</p>
                <button 
                  onClick={() => loadNews(activeCategory)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Main Content */}
          {!loading && !error && articles.length > 0 && (
            <>
              <HeroSection featuredArticle={featuredArticle} />
              
              {/* Latest News Section - ONLY 8 ARTICLES */}
              <NewsGrid 
                articles={articles.slice(1, 9)} // Articles 2-9 (8 articles)
                title="Latest News" 
              />

              {/* More News Grid - ONLY 4 ARTICLES */}
              {articles.length > 9 && (
                <NewsGrid 
                  articles={articles.slice(9, 13)} // Articles 10-13 (4 articles)
                  title="More News" 
                />
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && !error && articles.length === 0 && (
            <div className="container-custom py-12">
              <div className="text-center">
                <div className="text-6xl mb-4">📰</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No News Available</h2>
                <p className="text-gray-600 mb-6">We couldn't fetch any news articles at the moment.</p>
                <button 
                  onClick={() => loadNews(activeCategory)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Try Loading Again
                </button>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}