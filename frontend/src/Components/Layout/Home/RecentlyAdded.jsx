import React, { useEffect, useState } from 'react'
import axios from "axios"
import { BookCard } from "../../common/BookCard"
import { Loader } from '../../common/Loader'

export const RecentlyAdded = () => {
  const [Data, setData] = useState([])  // Initialize state with an empty array

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/get-recent-books')  // Single slash after get-recent-books
        setData(response.data.data)  // Update state with fetched data
      } catch (error) {
        console.error("Error fetching data:", error)  // Handle errors
      }
    }
    fetchBooks()
  }, [])  // Empty dependency array to trigger once after the initial render

  return (
    <div className='mt-8 px-4'>
      <h4 className='text-3xl text-yellow-100'>Recently Added Books</h4>
      {!Data &&
        <div className='flex items-center justify-center my-8'>
          <Loader />
        </div>
      }
      <div className='my-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4'>
        {Data && Data.map((item, i) => {
          return <div key={i}>
            <BookCard data={item} />
          </div>
        })
        }
      </div>
    </div>
  )
}
