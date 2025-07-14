const Category = require('../../models/Category');

exports.addCategory = async (req, res) => {
  const { name } = req.body;

  try {
    // Check if category already exists
    const categoryExists = await Category.findOne({ name: name });

    if (categoryExists) {
      return res
        .status(200)
        .json({ success: true, message: 'Category Already Exists' });
    }

    // Create new category
    const category = await Category.create({ name: name });
    

    res.status(201).json({ success: true, message:"Category Added Successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
