import axios from "axios";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Loader from "../../Components/common/Loader";
import BookCard from "../../Components/common/BookCard";
import { CiSearch, CiFilter } from "react-icons/ci";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../../store/books/authBooks";
import { setPage } from "../../store/books/booksSlice";
import { fetchCategories } from "../../store/categories/categoryThunks";
import { debounce } from "lodash";
import { useBookFilter, useBookSearch } from "../../hooks/Book";

const AllBooks = () => {
  const dispatch = useDispatch();
  const [filteredPage, setFilteredPage] = useState(1);
  const limit = 12;

  // get all books
  const { loading, currentPage, totalPages, books } = useSelector(
    (state) => state.book
  );
  //get all categories
  const { categories, loading: catLoading } = useSelector(
    (state) => state.categories
  );

  const [priceRange, setPriceRange] = useState(10000);
  const [filtered, setFiltered] = useState(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [sortType, setSortType] = useState("all");
  const [error, setError] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filterBookMutation = useBookFilter()
  const bookSearchMutation = useBookSearch()

  // fetch categories and books when application lodes
  // useEffect(() => {
  //   dispatch(fetchBooks({ page: 1, limit: 12 }));
  //   dispatch(fetchCategories());
  // }, [dispatch, limit]);

  const applyFilters = useCallback(
    async (cats, sort, max = priceRange, page = 1, limitVal = limit) => {
      try {
        setError(null);
        const params = {
          categories: cats.length ? cats.join(",") : undefined,
          sort: sort !== "all" ? sort : undefined,
          min: 0,
          max,
          page,
          limit: limitVal
        };

        filterBookMutation.mutate(params, {
          onSuccess: (response) => {
            setFiltered({
              books: response.books,
              currentPage: response.currentPage,
              totalPages: response.totalPages,
            });
          },
          onError: () => {
            setError("Failed to apply filters. Please try again.");
            setFiltered({ books: [], currentPage: 1, totalPages: 1 });
          }
        });

      } catch (err) {
        setError("Failed to apply filters. Please try again.");
        setFiltered({ books: [], currentPage: 1, totalPages: 1 });
      }
    },
    [priceRange]
  );

  const display = useMemo(() => {
    if (filtered && Array.isArray(filtered.books)) return filtered.books;
    return Array.isArray(books) ? books : [];
  }, [filtered, books]);

  useEffect(() => {
    if (search.trim()) {
      return;
    }
    setFilteredPage(1)

    if (selected.length || sortType !== "all" || priceRange !== 10000) {
      applyFilters(selected, sortType, priceRange, filteredPage, limit);
    } else {
      setFiltered(null);
    }
  }, [selected, sortType, priceRange, filteredPage, applyFilters]);

  const debouncedSearch = useMemo(() => debounce(async (query) => {
    const q = String(query || "").trim()
    if (!q) {
      setFiltered(null);
      return;
    }
    try {
      bookSearchMutation.mutate(q, {
        onSuccess: (response) => {
          setFiltered({ books: response, currentPage: 1, totalPages: 1 });
        },
        onError: () => {
          setError("Failed to search books. Please try again.");
          setFiltered({ books: [], currentPage: 1, totalPages: 1 });
        }
      });

    } catch (err) {
      setError("Failed to search books. Please try again.");
      setFiltered({ books: [], currentPage: 1, totalPages: 1 });
    }
  }, 500), []);

  //cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const toggleCategory = useCallback((categoryId) => {
    setSelected((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    debouncedSearch(search);
  };

  const handlePriceChange = (e) => setPriceRange(parseInt(e.target.value));

  const resetPriceRange = () => setPriceRange(10000);

  const clearFilters = () => {
    setFiltered(null);
    setFilteredPage(1);
    setSelected([]);
    setSortType("all");
    setSearch("");
    setPriceRange(10000);
    setError(null);

    dispatch(fetchBooks({ page: 1, limit }))
    dispatch(setPage(1))
  };

  const handlePrev = () => {
    if (search.trim()) {
      return;
    }

    if (filtered && filtered.currentPage > 1) setFilteredPage(p => p - 1);
    else if (!filtered && currentPage > 1) dispatch(setPage(currentPage - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (search.trim()) {
      return;
    }
    if (filtered && filtered.currentPage < filtered.totalPages) setFilteredPage(p => p + 1);
    else if (!filtered && currentPage < totalPages) dispatch(setPage(currentPage + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e) => setSortType(e.target.value);

  return (
    <main className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen px-4 sm:px-6 lg:px-8 py-8 text-white">
      <section className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4">
            Explore Our Collection
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover your next favorite book from our carefully curated selection
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg w-full justify-center"
          >
            <CiFilter className="text-xl" />
            <span>Filters</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 text-red-300 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg sticky top-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Search books..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-3 text-gray-400 hover:text-yellow-400"
                  >
                    <CiSearch className="text-xl" />
                  </button>
                </div>
              </form>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                  Categories
                </h3>
                {catLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-6 bg-gray-700 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat._id} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selected.includes(cat._id)}
                          onChange={() => toggleCategory(cat._id)}
                          className="w-4 h-4 rounded border-gray-600 text-yellow-500 focus:ring-yellow-500 bg-gray-700"
                        />
                        <span className="text-gray-300 hover:text-white">
                          {cat.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                  Price Range
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>₹0</span>
                    <span>₹{priceRange.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="200"
                    value={priceRange}
                    onChange={handlePriceChange}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                  <button
                    onClick={resetPriceRange}
                    className="text-sm text-yellow-400 hover:text-yellow-300"
                  >
                    Reset Price
                  </button>
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                  Sort By
                </h3>
                <select
                  value={sortType}
                  onChange={handleSortChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="all">Default</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Mobile Filters */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-end">
              <div className="bg-gray-800 w-4/5 max-w-sm h-full overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-yellow-400">Filters</h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <FiX className="text-2xl" />
                  </button>
                </div>

                {/* Mobile Filter Content */}
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Search books..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="absolute right-3 top-3 text-gray-400 hover:text-yellow-400"
                    >
                      <CiSearch className="text-xl" />
                    </button>
                  </div>
                </form>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat._id} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selected.includes(cat._id)}
                          onChange={() => toggleCategory(cat._id)}
                          className="w-4 h-4 rounded border-gray-600 text-yellow-500 focus:ring-yellow-500 bg-gray-700"
                        />
                        <span className="text-gray-300 hover:text-white">
                          {cat.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                    Price Range
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>₹0</span>
                      <span>₹{priceRange.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="200"
                      value={priceRange}
                      onChange={handlePriceChange}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                    />
                    <button
                      onClick={resetPriceRange}
                      className="text-sm text-yellow-400 hover:text-yellow-300"
                    >
                      Reset Price
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                    Sort By
                  </h3>
                  <select
                    value={sortType}
                    onChange={handleSortChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="all">Default</option>
                    <option value="lowToHigh">Price: Low to High</option>
                    <option value="highToLow">Price: High to Low</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Book Listing */}
          <div className="flex-1">
            {/* Active Filters */}
            {(filtered && filtered.totalPages > 1) || (!filtered && totalPages > 1) ? (
              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  onClick={handlePrev}
                  disabled={
                    (filtered && filtered.currentPage === 1) ||
                    (!filtered && currentPage === 1)
                  }
                  className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white disabled:bg-gray-800 disabled:text-gray-500"
                >
                  <FiChevronLeft size={20} />
                </button>
                <span className="text-gray-300">
                  Page {filtered ? filtered.currentPage : currentPage} of{" "}
                  {filtered ? filtered.totalPages : totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={
                    (filtered && filtered.currentPage === filtered.totalPages) ||
                    (!filtered && currentPage === totalPages)
                  }
                  className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white disabled:bg-gray-800 disabled:text-gray-500"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            ) : null}


            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gray-700 rounded-xl aspect-[2/3] animate-pulse"></div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && display.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-5xl mb-4">📚</div>
                <h3 className="text-xl font-medium text-gray-300 mb-2">
                  No books found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Book Grid */}
            {!loading && display.length > 0 && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {display.map((item) => (
                    <BookCard
                      key={item._id}
                      data={item}

                      className="transition-transform hover:scale-105 hover:shadow-lg"
                    />
                  ))}
                </div>

                {/* Pagination */}
                {!filtered && totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-4">
                    <button
                      onClick={handlePrev}
                      disabled={currentPage === 1}
                      className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white disabled:bg-gray-800 disabled:text-gray-500"
                      aria-label="Previous page"
                    >
                      <FiChevronLeft size={20} />
                    </button>
                    <span className="text-gray-300">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white disabled:bg-gray-800 disabled:text-gray-500"
                      aria-label="Next page"
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
export default AllBooks