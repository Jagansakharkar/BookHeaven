const express = require('express');
const Book = require('../../models/books');
const Category=require('../../models/Category')

// GET /api/admin/inventory/summary
exports.summary = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const lowStock = await Book.countDocuments({ stock: { $lt: 10,$gt:0 } });
    const bookCategories = await Category.countDocuments();

   console.log("summary",bookCategories)
    res.status(200).json({
      success: true,
      data: {
        totalBooks,
        lowStock,
        bookCategories
      }
    });
  } catch (error) {
    console.error("Inventory summary error:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching inventory summary"
    });
  }
}
exports.getBooksAlert=async(req,res)=>{
 try{
  
  const lowStockBooks=await Book.find({'stock':{$lt:10,$gt:0}}).select('_id title stock')
      const outOfStock = await Book.find({ stock: 0 }).select('_id title stock');
      
 res.status(200).json({success:true,lowStockBooks,outOfStock})
}catch(error){
 res.status(500).json({success:false,message:"Interal Server Error"})
}

}