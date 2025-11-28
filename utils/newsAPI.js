// utils/newsAPI.js

// Environment variables
const API_KEY = 'f5b294a3872f4f5cb306ffe303f06ee2';
const BASE_URL = 'https://newsapi.org/v2';

// 🔥 GET ALL NEWS ARTICLES - NO CACHE, ALWAYS FRESH
export async function getAllNews(category = 'general', pageSize = 20) {
  try {
    console.log('📰 Fetching LIVE news from API...');
    const response = await fetch(
      `${BASE_URL}/top-headlines?country=us&category=${category}&pageSize=${pageSize}&apiKey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === 'error') {
      throw new Error(data.message);
    }
    
    const articles = data.articles || [];
    
    // Filter out articles with [Removed] content and add fallback content
    const filteredArticles = articles.map(article => ({
      ...article,
      content: article.content && article.content !== '[Removed]' 
        ? article.content 
        : article.description || 'Full article content not available. Please click "Read Original" for complete details.',
      description: article.description || 'No description available...',
      // Add unique ID for better tracking
      id: article.title ? article.title.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-') : Math.random().toString(36)
    })).filter(article => article.title && article.title !== '[Removed]');

    console.log('✅ Fresh news loaded:', filteredArticles.length + ' articles');
    
    return filteredArticles;
  } catch (error) {
    console.error('❌ Error fetching news:', error.message);
    console.log('📰 Using mock data as fallback');
    return getMockNews();
  }
}

// 🔥 IMPROVED GET ARTICLE BY ID WITH BETTER MATCHING
export async function getNewsArticleById(articleId) {
  try {
    console.log('🔍 Searching for article:', articleId);
    
    // First, try to get from current articles (if available)
    let allArticles = [];
    
    // Try to get from localStorage or session storage first
    if (typeof window !== 'undefined') {
      const savedArticles = localStorage.getItem('currentNewsArticles');
      if (savedArticles) {
        allArticles = JSON.parse(savedArticles);
        console.log('📚 Found', allArticles.length, 'articles in storage');
      }
    }
    
    // If no saved articles, fetch fresh ones
    if (allArticles.length === 0) {
      console.log('📡 Fetching fresh articles for search...');
      const response = await fetch(
        `${BASE_URL}/top-headlines?country=us&pageSize=50&apiKey=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      allArticles = data.articles || [];
    }
    
    if (allArticles.length > 0) {
      // Clean the articleId for better matching
      const cleanArticleId = articleId
        .toLowerCase()
        .replace(/-+/g, '-') // Remove multiple dashes
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
      
      console.log('🔄 Cleaned article ID:', cleanArticleId);
      
      // 1. Try exact slug match
      let foundArticle = allArticles.find(article => {
        if (!article.title) return false;
        
        const articleSlug = article.title
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '') // Keep only letters, numbers, spaces
          .replace(/\s+/g, '-') // Replace spaces with dashes
          .replace(/-+/g, '-') // Remove multiple dashes
          .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
          
        return articleSlug === cleanArticleId;
      });
      
      // 2. Try partial match with words
      if (!foundArticle) {
        console.log('🔍 Trying partial match...');
        const searchWords = cleanArticleId.split('-').filter(word => word.length > 2);
        
        foundArticle = allArticles.find(article => {
          if (!article.title) return false;
          
          const articleTitle = article.title.toLowerCase();
          return searchWords.some(word => articleTitle.includes(word));
        });
      }
      
      // 3. Try fuzzy match with first few words
      if (!foundArticle) {
        console.log('🔍 Trying fuzzy match...');
        const firstFewWords = cleanArticleId.split('-').slice(0, 3).join(' ');
        
        foundArticle = allArticles.find(article => {
          if (!article.title) return false;
          return article.title.toLowerCase().includes(firstFewWords);
        });
      }
      
      if (foundArticle) {
        console.log('✅ Found matching article:', foundArticle.title);
        
        // Enhance the article content
        const enhancedArticle = {
          ...foundArticle,
          content: foundArticle.content && foundArticle.content !== '[Removed]' 
            ? foundArticle.content 
            : foundArticle.description || getFullContent(foundArticle.title),
          description: foundArticle.description || 'No description available...'
        };
        
        return enhancedArticle;
      }
    }
    
    // If no match found in API data
    console.log('❌ No matching article found in API data');
    throw new Error('Article not found in current news');
    
  } catch (error) {
    console.error('❌ Error in getNewsArticleById:', error.message);
    
    // Only use mock data as last resort
    console.log('🔄 Falling back to mock data...');
    return getMockArticleById(articleId);
  }
}

// 🔥 GENERATE BETTER CONTENT FOR ARTICLES
function getFullContent(title) {
  // Generate more relevant content based on title keywords
  if (title.toLowerCase().includes('digital payment') || title.toLowerCase().includes('upi')) {
    return `A quiet revolution is sweeping across rural India as digital payment platforms transform traditional economic systems. Villages that once relied entirely on cash transactions are now embracing UPI payments, mobile banking, and digital wallets at an unprecedented rate.

Local shopkeepers, farmers, and small business owners report significant improvements in efficiency and security since adopting digital payments. "Earlier, we had to travel hours to deposit cash. Now, everything happens instantly on our phones," says a village grocery store owner in Uttar Pradesh.

The government's Digital India initiative, combined with improved internet connectivity, has created an environment where even the smallest transactions are going digital, bringing millions into the formal economy. This shift is particularly impactful in remote areas where banking infrastructure was previously limited.

Small businesses are experiencing growth as they can now accept payments from customers who previously only carried cash. Farmers can receive payments for their produce directly into their bank accounts, reducing reliance on middlemen and improving transparency in agricultural transactions.`;
  }
  
  if (title.toLowerCase().includes('space') || title.toLowerCase().includes('isro')) {
    return `The Indian Space Research Organisation (ISRO) continues to make significant strides in space exploration and technology. Recent missions have focused on climate monitoring, satellite communication, and planetary exploration.

The success of these missions demonstrates India's growing capabilities in space technology and its commitment to using space resources for national development and global environmental monitoring.

Scientists and engineers at ISRO are working on ambitious projects including lunar exploration, Mars missions, and advanced satellite systems that will benefit various sectors including agriculture, disaster management, and communication.`;
  }
  
  if (title.toLowerCase().includes('startup') || title.toLowerCase().includes('bangalore')) {
    return `The startup ecosystem in India is experiencing unprecedented growth, with innovative companies emerging across various sectors including technology, healthcare, education, and renewable energy.

These startups are not only creating new job opportunities but also solving complex problems through technology and innovation, contributing significantly to India's economic growth and global technological presence.

Venture capital investments have reached record levels, and several Indian startups have achieved unicorn status, attracting international attention and partnerships.`;
  }
  
  if (title.toLowerCase().includes('sports') || title.toLowerCase().includes('athlete')) {
    return `Indian athletes continue to achieve remarkable success on international platforms, bringing pride to the nation and inspiring young sports enthusiasts across the country.

The improved sports infrastructure, better training facilities, and increased corporate sponsorship have created an environment where Indian athletes can compete at the highest levels globally.

Recent performances in various international championships have demonstrated the potential of Indian sports talent and the positive impact of systematic sports development programs.`;
  }
  
  // Generic content for other articles
  return `This article discusses important developments and current affairs. The full content focuses on recent events and their implications across various sectors.

For complete details and in-depth analysis, please refer to the original source publication. The ongoing developments reflect the dynamic nature of current events and their impact on society, economy, and technology.

Stay updated with LiveHindustan for the latest news and comprehensive coverage of events shaping our world today.`;
}

// 🔥 FORCE REFRESH NEWS (now just an alias for getAllNews)
export async function forceRefreshNews() {
  console.log('🔄 Manual refresh triggered');
  return await getAllNews();
}

// 🔥 SEARCH NEWS
export async function searchNews(query, pageSize = 20) {
  try {
    const response = await fetch(
      `${BASE_URL}/everything?q=${encodeURIComponent(query)}&pageSize=${pageSize}&apiKey=${API_KEY}&sortBy=publishedAt`
    );
    
    const data = await response.json();
    const articles = data.articles || [];
    
    // Filter and enhance articles
    return articles.map(article => ({
      ...article,
      content: article.content && article.content !== '[Removed]' 
        ? article.content 
        : article.description || 'Full article content not available.',
      description: article.description || 'No description available...'
    })).filter(article => article.title && article.title !== '[Removed]');
  } catch (error) {
    console.error('❌ Error searching news:', error.message);
    return [];
  }
}

// 🔥 GET NEWS BY CATEGORY
export async function getNewsByCategory(category, pageSize = 20) {
  return await getAllNews(category, pageSize);
}

// 🔥 GET TOP HEADLINES
export async function getTopHeadlines(country = 'us', pageSize = 10) {
  try {
    const response = await fetch(
      `${BASE_URL}/top-headlines?country=${country}&pageSize=${pageSize}&apiKey=${API_KEY}`
    );
    
    const data = await response.json();
    const articles = data.articles || [];
    
    return articles.map(article => ({
      ...article,
      content: article.content && article.content !== '[Removed]' 
        ? article.content 
        : article.description || 'Full article content not available.',
      description: article.description || 'No description available...'
    })).filter(article => article.title && article.title !== '[Removed]');
  } catch (error) {
    console.error('❌ Error fetching top headlines:', error.message);
    return getMockNews().slice(0, pageSize);
  }
}

// 🎯 MOCK DATA - UPDATED WITH FRESH CONTENT
function getMockNews() {
  const mockArticles = [
    {
      title: 'India Launches New Space Mission to Study Climate Change',
      description: 'ISRO successfully launches advanced satellite to monitor environmental changes and weather patterns across South Asia.',
      content: `The Indian Space Research Organisation (ISRO) has achieved another milestone with the successful launch of its latest climate observation satellite. The advanced spacecraft is equipped with state-of-the-art sensors designed to monitor atmospheric conditions, ocean temperatures, and deforestation patterns across South Asia.`,
      publishedAt: new Date().toISOString(),
      author: 'Science Correspondent',
      source: { name: 'Space & Technology Daily' },
      urlToImage: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=600&h=400&fit=crop',
      url: '#'
    },
    {
      title: 'Digital Payment Revolution Transforms Rural Indian Economy',
      description: 'UPI and mobile banking bring financial inclusion to remote villages, boosting local businesses and economic growth.',
      content: `A quiet revolution is sweeping across rural India as digital payment platforms transform traditional economic systems. Villages that once relied entirely on cash transactions are now embracing UPI payments, mobile banking, and digital wallets at an unprecedented rate.`,
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      author: 'Economic Times Bureau',
      source: { name: 'Business Today' },
      urlToImage: 'https://images.unsplash.com/photo-1563013541-2d0c14a00c9e?w=600&h=400&fit=crop',
      url: '#'
    },
    {
      title: 'Startup Ecosystem in Bangalore Reaches New Heights',
      description: 'Silicon Valley of India attracts record investments as innovative startups solve global challenges.',
      content: `Bangalore's startup ecosystem is experiencing unprecedented growth, with venture capital investments reaching an all-time high in the first quarter. The city has become a hub for innovation in artificial intelligence, renewable energy, and healthcare technology.`,
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      author: 'Tech Innovation Network',
      source: { name: 'Startup India' },
      urlToImage: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=600&h=400&fit=crop',
      url: '#'
    }
  ];

  return mockArticles.sort(() => Math.random() - 0.5);
}

// 🎯 GET MOCK ARTICLE BY ID
function getMockArticleById(articleId) {
  const mockArticles = getMockNews();
  const foundArticle = mockArticles.find(article => 
    article.title.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-') === articleId
  );
  return foundArticle || mockArticles[0];
}

// 🔥 DEFAULT EXPORT
export default {
  getAllNews,
  getNewsArticleById,
  searchNews,
  getNewsByCategory,
  getTopHeadlines,
  forceRefreshNews
};