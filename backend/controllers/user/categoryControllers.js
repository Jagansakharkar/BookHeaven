const Category = require('../../models/Category');

exports.getAllCategories = async (req, res) => {
  try {
    const category = await Category.find();

    if (category.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No categories found',
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
