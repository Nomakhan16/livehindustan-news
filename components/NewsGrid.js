import NewsCard from './NewsCard';

export default function NewsGrid({ articles, title, featured = false }) {
  return (
    <section className="py-12">
      <div className="container-custom">
        {/* Enhanced Heading */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="heading-primary text-4xl font-bold bg-gradient-to-r from-gray-900 to-red-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-medium">
              {articles.length} {articles.length === 1 ? 'Article' : 'Articles'}
            </span>
          </div>
        </div>

        {/* Enhanced Grid with Animation Stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {articles.map((article, index) => (
            <div 
              key={article.title + index}
              className="fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <NewsCard
                article={article}
                featured={featured && index === 0}
              />
            </div>
          ))}
        </div>

        {/* Load More Button (Optional) */}
        {articles.length > 8 && (
          <div className="text-center mt-12">
            <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-md font-medium">
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </section>
  );
}