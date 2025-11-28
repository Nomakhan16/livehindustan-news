import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection({ featuredArticle }) {
  if (!featuredArticle) {
    featuredArticle = {
      title: "India's Economy Shows Strong Growth in Q3 2024",
      description: "Latest economic indicators show robust growth across multiple sectors with manufacturing and services leading the way. Government initiatives continue to drive economic recovery.",
      urlToImage: "https://images.unsplash.com/photo-1584824486539-53bb4646bdbc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      publishedAt: new Date().toISOString(),
      source: { name: "Economic Times" }
    };
  }

  const articleSlug = featuredArticle.title.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return (
    <section className="bg-white py-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Featured Article */}
          <div className="lg:col-span-2">
            <Link href={`/article/${articleSlug}`}>
              <div className="news-card cursor-pointer">
                <div className="relative h-80 md:h-96 bg-gray-200">
                  {featuredArticle.urlToImage ? (
                    <Image
                      src={featuredArticle.urlToImage}
                      alt={featuredArticle.title}
                      fill
                      className="object-cover"
                      priority
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : null}
                  {/* Fallback gradient */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 ${
                      featuredArticle.urlToImage ? 'hidden' : 'flex'
                    } items-center justify-center`}
                  >
                    <div className="text-white text-6xl opacity-20">LH</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <span className="bg-red-600 text-xs px-2 py-1 rounded uppercase font-semibold">
                      Featured
                    </span>
                    <h1 className="text-2xl md:text-3xl font-bold mt-2 leading-tight">
                      {featuredArticle.title}
                    </h1>
                    <p className="text-gray-200 mt-2 line-clamp-2">
                      {featuredArticle.description}
                    </p>
                    <div className="flex items-center mt-3 text-sm">
                      <span>{new Date(featuredArticle.publishedAt).toLocaleDateString('en-IN')}</span>
                      <span className="mx-2">•</span>
                      <span>{featuredArticle.source?.name || "LiveHindustan"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Side Featured Articles */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Top Stories</h2>
            <div className="space-y-4">
              {[
                {
                  title: "Breaking: Major Policy Announcement Expected Today",
                  time: "1 hour ago"
                },
                {
                  title: "Sports: National Team Wins Championship",
                  time: "2 hours ago"
                },
                {
                  title: "Technology: New Innovation Revolutionizes Industry",
                  time: "3 hours ago"
                },
                {
                  title: "Entertainment: Blockbuster Movie Breaks Records",
                  time: "4 hours ago"
                }
              ].map((story, i) => (
                <div key={i} className="flex space-x-3 pb-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 hover:text-red-600 cursor-pointer text-sm leading-tight">
                      {story.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{story.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">News in Numbers</h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-white rounded p-2">
                  <div className="text-lg font-bold text-red-600">24+</div>
                  <div className="text-xs text-gray-600">News Categories</div>
                </div>
                <div className="bg-white rounded p-2">
                  <div className="text-lg font-bold text-red-600">50+</div>
                  <div className="text-xs text-gray-600">Reporters</div>
                </div>
                <div className="bg-white rounded p-2">
                  <div className="text-lg font-bold text-red-600">1M+</div>
                  <div className="text-xs text-gray-600">Daily Readers</div>
                </div>
                <div className="bg-white rounded p-2">
                  <div className="text-lg font-bold text-red-600">15+</div>
                  <div className="text-xs text-gray-600">Cities Covered</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}