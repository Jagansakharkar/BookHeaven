import axios from "axios";
import React, { useState, useEffect } from "react";
import { Loader } from "../../Components/common/Loader";
import { BookCard } from "../../Components/common/BookCard";
import { CiSearch } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../../store/books/authBooks";
import { setPage } from "../../store/books/booksSlice";
import { fetchCategories } from "../../store/categories/categoryThunks"; 

export const AllBooks = () => {
  const dispatch = useDispatch();

  const { loading, currentPage, totalPages, books } = useSelector(
    (state) => state.book
  );

  const { categories, loading: catLoading } = useSelector(
    (state) => state.categories
  );

  const [priceRange, setPriceRange] = useState(10000);
  const [filtered, setFiltered] = useState(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [sortType, setSortType] = useState("all");

  useEffect(() => {
    if (!filtered) dispatch(fetchBooks({ page: currentPage, limit: 8 }));
  }, [dispatch, currentPage, filtered]);


  const applyFilters = async (cats, sort, max = priceRange) => {
    try {
      const params = new URLSearchParams();
      if (cats.length > 0) params.append("categories", cats.join(","));
      if (sort !== "all") params.append("sort", sort);
      if (max) {
        params.append("min", 0);
        params.append("max", max);
      }

      const url = `http://localhost:3000/api/books/books_filter?${params.toString()}`;
      const res = await axios.get(url);

      const result = Array.isArray(res.data.data) ? res.data.data : [];
      setFiltered(result);
    } catch (err) {
      console.error("Filter error:", err);
      setFiltered([]);
    }
  };

  const toggleCategory = (category) => {
    const next = selected.includes(category)
      ? selected.filter((c) => c !== category)
      : [...selected, category];
    setSelected(next);
    applyFilters(next, sortType);
  };

  const handleSortChange = (e) => {
    const sort = e.target.value;
    setSortType(sort);
    applyFilters(selected, sort);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    try {
      const res = await axios.get(
        `http://localhost:3000/api/books/search?query=${search.trim()}`
      );
      const result = Array.isArray(res.data.data) ? res.data.data : [];
      setFiltered(result);
    } catch (err) {
      setFiltered([]);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) dispatch(setPage(currentPage - 1));
  };

  const handleNext = () => {
    if (currentPage < totalPages) dispatch(setPage(currentPage + 1));
  };

  const clearFilters = () => {
    setFiltered(null);
    setSelected([]);
    setSortType("all");
    setSearch("");
  };

  const display = Array.isArray(filtered)
    ? filtered
    : Array.isArray(books)
      ? books
      : [];

  return (
    <div className="bg-zinc-900 min-h-screen px-4 sm:px-6 md:px-12 py-8 text-white">
      <h1 className="text-3xl font-bold text-yellow-100 text-center mb-10">
        All Books
      </h1>

      {/* Controls */}
      <div className="max-w-6xl mx-auto flex flex-col gap-8 md:flex-row md:justify-between md:items-start mb-10">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex w-full md:w-1/2 gap-3">
          <input
            type="text"
            className="flex-grow px-4 py-3 rounded-md text-black shadow-md border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Search for books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 transition px-4 py-3 rounded-md"
          >
            <CiSearch className="h-6 w-6" />
          </button>
        </form>

        {/* Filters & Sort */}
        <div className="bg-zinc-800 p-6 rounded-lg shadow-md w-full md:w-1/2 space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-yellow-200">
              Filter by Categories
            </h3>

            {catLoading ? (
              <p className="text-sm text-zinc-400">Loading categories...</p>
            ) : (
              <div className="flex flex-wrap gap-4">
                {categories.map((cat) => (
                  <label
                    key={cat._id}
                    className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(cat.name)}
                      onChange={() => toggleCategory(cat.name)}
                      className="accent-yellow-400 w-4 h-4"
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <select
              className="p-3 rounded-md text-black border border-zinc-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={handleSortChange}
              value={sortType}
            >
              <option value="all">Price: All</option>
              <option value="highToLow">High to Low</option>
              <option value="lowToHigh">Low to High</option>
            </select>
          </div>

          {/* Filter by Price Range */}
          <div className="flex align-middle justify-between">
            <span className="font-semibold">Filter by Price:</span>
            <input
              type="range"
              name="priceRange"
              id="priceRange"
              min={0}
              max={10000}
              step={200}
              value={priceRange}
              onChange={(e) => {
                const maxVal = parseInt(e.target.value);
                setPriceRange(maxVal);
                applyFilters(selected, sortType, maxVal);
              }}
            />
            <span>₹0 to ₹{priceRange}</span>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {filtered && (
        <div className="mb-6 text-center">
          <button
            onClick={clearFilters}
            className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-md font-semibold shadow-md transition"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Loader */}
      {loading && (
        <div className="flex justify-center my-12">
          <Loader />
        </div>
      )}

      {/* No Books */}
      {!loading && display?.length === 0 && (
        <p className="text-center text-zinc-400">No books found.</p>
      )}

      {/* Book Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-10">
        {display.map((item, index) => (
          <div
            key={index}
            className="transition-transform hover:scale-[1.03] hover:shadow-lg duration-200"
          >
            <BookCard data={item} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {!filtered && (
        <div className="flex justify-center mt-10 gap-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-5 py-2 rounded-full font-semibold bg-yellow-500 text-black hover:bg-yellow-600 transition disabled:bg-gray-500"
          >
            Prev
          </button>
          <span className="px-4 py-2 text-xl font-medium">
            {currentPage}/{totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-5 py-2 rounded-full font-semibold bg-yellow-500 text-black hover:bg-yellow-600 transition disabled:bg-gray-500"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
