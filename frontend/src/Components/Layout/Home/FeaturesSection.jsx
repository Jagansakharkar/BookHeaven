export const FeaturesSection = () => {
  const features = [
    { icon: '📚', title: 'Wide Book Collection', desc: 'Thousands of books from all genres and authors.' },
    { icon: '🔍', title: 'Smart Search & Filters', desc: 'Find books easily by genre, price, author, or rating.' },
    { icon: '❤️', title: 'Wishlist Support', desc: 'Save favorite books for later in one click.' },
    { icon: '🛒', title: 'Secure Checkout', desc: 'Fast and secure order placement and payment.' },
    { icon: '🚚', title: 'Fast Delivery', desc: 'Get books delivered within 3–5 business days.' },
    { icon: '🔁', title: 'Easy Returns', desc: 'Return any product within 7 days hassle-free.' },
  ];

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Shop With Us?</h2>
        <p className="text-gray-500 mb-12">We make book buying easier, faster, and more enjoyable.</p>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 text-left">
          {features.map((f, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="text-3xl">{f.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
