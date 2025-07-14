import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../../Components/common/BackButton';

import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../../store/Categories/categoryThunks';

// Reusable components
import InputField from '../../Components/common/InputField';
import TextAreaField from '../../Components/common/TextAreaField';
import SelectField from '../../Components/common/SelectField';

export const AddBook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, userid } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.categories);

  const [Data, setData] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    desc: "",
    language: "",
    stock: "",
    category: "",
    publisher: "",
    publishedDate: "",
    pages: ""
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const headers = {
    userid,
    authorization: `Bearer ${token}`
  };

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const handleBookSubmit = async () => {
    try {
      const {
        url, title, author, price, desc,
        language, stock, category, publisher,
        publishedDate, pages
      } = Data;

      if (!url || !title || !author || !price || !desc || !language || !stock || !category || !publisher || !publishedDate || !pages) {
        Swal.fire({ icon: 'error', text: "All fields are required" });
        return;
      }

      const response = await axios.post("http://localhost:3000/api/admin/books/add-book", Data, { headers });

      if (response.data.success) {
        Swal.fire({ icon: 'success', text: response.data.message });
        setTimeout(() => navigate("/all-books"), 3000);
      } else {
        Swal.fire({ icon: 'error', text: response.data.message });
        setTimeout(() => navigate("/profile/add-book"), 1000);
      }

      setData({
        url: "", title: "", author: "", price: "", desc: "",
        language: "", stock: "", category: "", publisher: "",
        publishedDate: "", pages: ""
      });

    } catch (error) {
      console.error(error);
      Swal.fire({ icon: 'error', text: "Something Went Wrong" });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 px-4 md:px-12 py-10 text-white">
      <BackButton to="/admin/dashboard/inventory" text="Back" />

      <div className="bg-zinc-800 p-8 rounded-2xl shadow-md max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-100 mb-8 text-center">Add New Book</h1>

        <InputField
          label="Book Image URL"
          name="url"
          value={Data.url}
          onChange={change}
          placeholder="Image URL"
        />

        <InputField
          label="Book Title"
          name="title"
          value={Data.title}
          onChange={change}
          placeholder="Title"
        />

        <InputField
          label="Author"
          name="author"
          value={Data.author}
          onChange={change}
          placeholder="Author"
        />

        <div className="mb-5 flex flex-col md:flex-row gap-6">
          <InputField
            label="Language"
            name="language"
            value={Data.language}
            onChange={change}
            placeholder="Language"
          />
          <InputField
            label="Price"
            name="price"
            value={Data.price}
            onChange={change}
            placeholder="Price"
          />
        </div>

        <div className="mb-5 flex flex-col md:flex-row gap-6">
          <SelectField
            label="Category"
            name="category"
            value={Data.category}
            onChange={change}
            options={categories}
          />
          <InputField
            label="Publisher"
            name="publisher"
            value={Data.publisher}
            onChange={change}
            placeholder="Publisher"
          />
        </div>

        <div className="mb-5 flex flex-col md:flex-row gap-6">
          <InputField
            label="Published Date"
            name="publishedDate"
            value={Data.publishedDate}
            onChange={change}
            type="date"
          />
          <InputField
            label="Pages"
            name="pages"
            value={Data.pages}
            onChange={change}
            type="number"
            placeholder="Total Pages"
          />
        </div>

        <TextAreaField
          label="Description"
          name="desc"
          value={Data.desc}
          onChange={change}
          placeholder="Description"
        />

        <InputField
          label="Stock Quantity"
          name="stock"
          value={Data.stock}
          onChange={change}
          placeholder="Stock"
        />

        <div className="flex justify-center">
          <button
            onClick={handleBookSubmit}
            className="bg-yellow-500 hover:bg-yellow-600 transition px-10 py-3 text-black font-semibold rounded-lg shadow"
          >
            Add Book
          </button>
        </div>
      </div>
    </div>
  );
};
