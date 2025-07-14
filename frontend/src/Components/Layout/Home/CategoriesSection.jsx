import { useSelector } from "react-redux";

export const CategoriesSection = () => {
  const { categories, loading: catLoading } = useSelector(
    (state) => state.categories
  );

  return (
    <section className="bg-gray-50 py-14">
      <h3 className="text-3xl font-bold text-center mb-8">Browse by Category</h3>
      <div className="flex flex-wrap justify-center gap-4 px-4">
        {categories.map((cat) => (
          <button
            key={cat._id}
            className="px-6 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition text-sm font-medium"
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
};
