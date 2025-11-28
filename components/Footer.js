export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white py-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">LH</span>
              </div>
              <span className="text-xl font-bold">LiveHindustan</span>
            </div>
            <p className="text-gray-400 text-sm">
              Serving you with the Latest News.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {['National', 'Politics', 'Business', 'Sports', 'Entertainment', 'Technology'].map((cat) => (
                <li key={cat} className="hover:text-white cursor-pointer transition-colors duration-200">{cat}</li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {['About Us', 'Contact', 'Careers', 'Advertise', 'Terms', 'Privacy'].map((item) => (
                <li key={item} className="hover:text-white cursor-pointer transition-colors duration-200">{item}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <div className="text-sm text-gray-400 space-y-2">
              <p>📞 +91 98XXXXXX00</p>
              <p>✉️ livehindustan@gmail.com</p>
              <p>📍 Lucknow, India</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} LiveHindustan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}