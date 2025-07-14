import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { BackButton } from '../../Components/common/BackButton';
import InputField from '../../Components/common/InputField';
import TextAreaField from '../../Components/common/TextAreaField';

import { useSelector } from 'react-redux';

export const UpdateBook = () => {
  const navigate = useNavigate();
  const { bookid } = useParams(); // Correctly get book ID

  const { userid, token } = useSelector((state) => state.auth);
  const headers = {
    userid,
    authorization: `Bearer ${token}`,
  };

  const [Data, setData] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    desc: "",
    language: "",
  });

  // Fetch book data by ID
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/books/get-book-by-id/${bookid}`, { headers });

        if (response.data.success) {
          const book = response.data.data;
          setData({
            url: book.url || "",
            title: book.title || "",
            author: book.author || "",
            price: book.price?.toString() || "",
            desc: book.desc || "",
            language: book.language || "",
          });
        } else {
          Swal.fire({ icon: "error", text: "Error fetching book data" });
        }
      } catch (error) {
        Swal.fire({ icon: "error", text: "Error: " + error });
      }
    };
    fetchBook();
  }, [bookid]);

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submit = async () => {
    const { url, title, author, price, desc, language } = Data;

    if (!url || !title || !author || !price || !desc || !language) {
      Swal.fire({ icon: 'warning', text: 'All fields are required' });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/update-book",
        Data,
        {
          headers: { ...headers, bookid }, // corrected `bookid`
        }
      );

      if (response.data.success) {
        Swal.fire({ icon: 'success', text: response.data.message });
        setTimeout(() => navigate("/all-books"), 2000);
      } else {
        Swal.fire({ icon: 'error', text: response.data.message });
        navigate(`/view-book-details/${bookid}`);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", text: "Something went wrong" });
    }
  };

  return (
    <div className="min-h-screen px-4 md:px-20 py-10 bg-zinc-900 text-white">
      <BackButton to={-1} text="Back" />

      <div className="max-w-4xl mx-auto bg-zinc-800 p-6 md:p-10 rounded-lg shadow-lg">
        <h1 className="text-3xl md:text-5xl font-semibold text-blue-400 mb-8 text-center">
          Update Book
        </h1>

        {/* Fields */}
        <InputField
          label="Image URL"
          name="url"
          value={Data.url}
          onChange={change}
          placeholder="URL of image"
        />

        <InputField
          label="Title of Book"
          name="title"
          value={Data.title}
          onChange={change}
          placeholder="Title of Book"
        />

        <InputField
          label="Author"
          name="author"
          value={Data.author}
          onChange={change}
          placeholder="Author of Book"
        />

        <div className="mb-6 md:flex gap-6">
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

        <TextAreaField
          label="Description"
          name="desc"
          value={Data.desc}
          onChange={change}
          placeholder="Description"
          rows={5}
        />

        {/* Buttons */}
        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={submit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow transition duration-300"
          >
            Update
          </button>
          <button
            onClick={() => navigate(`/view-book-details/${bookid}`)}
            className="bg-zinc-600 hover:bg-zinc-700 text-white px-6 py-2 rounded shadow transition duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
