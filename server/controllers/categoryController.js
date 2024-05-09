import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const  createCategoryController= async (req, res) => {
  try {
    const { nameRo, nameRu } = req.body;
    // Verificăm dacă numele pentru ambele limbi sunt furnizate
    if (!nameRo || !nameRu) {
      return res.status(400).send({ message: "Name is required in both Romanian and Russian" });
    }

    // Verificăm dacă există deja categoria în oricare limbă
    const existingCategory = await categoryModel.findOne({ 
      $or: [{ nameRo }, { nameRu }] 
    });
    if (existingCategory) {
      return res.status(409).send({
        success: false,
        message: "Category already exists in one of the languages",
      });
    }

    // Creăm categoria cu slug-uri generate pentru fiecare limbă
    const category = await new categoryModel({
      nameRo,
      nameRu,
      slug: slugify(nameRo, { lower: true }),
      
    }).save();

    // Răspunsul de succes cu categoria creată
    res.status(201).send({
      success: true,
      message: "New category created successfully",
      category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating category",
    });
  }
};


//update category
export const updateCategoryController = async (req, res) => {
  try {
    const { nameRo, nameRu } = req.body;
    const { id } = req.params;

    // Verificăm dacă ambele nume sunt furnizate
    if (!nameRo || !nameRu) {
      return res.status(400).send({ message: "Both Romanian and Russian names are required." });
    }

    // Verificăm dacă există o altă categorie cu aceleași nume
    const existingCategory = await categoryModel.findOne({
      _id: { $ne: id },
      $or: [{ nameRo }, { nameRu }]
    });

    if (existingCategory) {
      return res.status(409).send({
        success: false,
        message: "Another category with the same name in one of the languages already exists."
      });
    }

    // Actualizăm categoria cu noile nume și slug-uri
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { 
        nameRo, 
        nameRu, 
        slug: slugify(nameRo, { lower: true }),
        
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating the category",
    });
  }
};

// get all cat
export const categoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All Categories List",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
};




// single category
export const singleCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;

    // Validare slug
    if (!slug) {
      return res.status(400).send({
        success: false,
        message: "Invalid category slug"
      });
    }

    const category = await categoryModel.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found"
      });
    }

    // Răspuns de succes
    res.status(200).send({
      success: true,
      message: "Single Category Retrieved Successfully",
      category
    });
  } catch (error) {
    // Logare eroare la consolă
    console.error("Server error while getting single category:", error);
    // Răspuns generic de eroare pentru client
    res.status(500).send({
      success: false,
      message: "An error occurred while retrieving the category"
    });
  }
};

//delete category
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await categoryModel.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).send({
        success: false,
        message: "Category not found"
      });
    }
    res.status(200).send({
      success: true,
      message: "Category Deleted Successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting category",
      error
    });
  }
};