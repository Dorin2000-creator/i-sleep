import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import fs from "fs";
import slugify from "slugify";
import dotenv from "dotenv";
dotenv.config();

export const createProductController = async (req, res) => {
  try {
    const {
      name_ro, name_ru,
      description_ro, description_ru,
      category,
      sizes,
      kg,
      important,
      characteristics,
      technical_structure
    } = req.fields;
    const { photo } = req.files;

    // Validation
    if (!name_ro || !name_ru) return res.status(400).send({ error: "Name in both languages is required." });
    if (!description_ro || !description_ru) return res.status(400).send({ error: "Description in both languages is required." });
    if (!category) return res.status(400).send({ error: "Category is required." });
    if (photo && photo.size > 1000000) return res.status(400).send({ error: "Photo should be less than 1MB." });
    
    // Parse JSON fields
    const parseJSON = (input) => {
      try {
        return JSON.parse(input);
      } catch (e) {
        return [];
      }
    };

    // Creating the product with parsed fields
    const product = new productModel({
      name_ro,
      name_ru,
      slug: slugify(name_ro),     
      description_ro,
      description_ru,
      kg,
      category,
      sizes: parseJSON(sizes),
      important: parseJSON(important),
      characteristics: parseJSON(characteristics),
      technical_structure: parseJSON(technical_structure)
    });

    // Handling photo
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    // Save the product to the database
    await product.save();

    // Send a response back to the client
    res.status(201).send({
      success: true,
      message: "Product created successfully.",
      product
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error creating product.",
      error: error.message
    });
  }
};


// export const updateProductController = async (req, res) => {
//   try {
//     const {
//       name_ro, name_ru,
//       description_ro, description_ru,
//       category,
//       sizes,
//       kg,
//       important,
//       characteristics,
//       technical_structure
//     } = req.fields;
//     const { photo } = req.files;
//     const productSlug = req.params.productSlug; // sau orice nume ai pentru parametrul ID din ruta

//     // Validation
//     if (!name_ro || !name_ru) return res.status(400).send({ error: "Numele este necesar în ambele limbi." });
//     if (!description_ro || !description_ru) return res.status(400).send({ error: "Descrierea este necesară în ambele limbi." });
//     if (!category) return res.status(400).send({ error: "Categoria este obligatorie." });
//     if (photo && photo.size > 1000000) return res.status(400).send({ error: "Fotografia trebuie să fie mai mică de 1MB." });

//     // Parse JSON fields
//     const parseJSON = (input) => {
//       try {
//         return JSON.parse(input);
//       } catch (e) {
//         return [];
//       }
//     };

//     const updatedData = {
//       name_ro,
//       name_ru,
//       slug: slugify(name_ro),
//       description_ro,
//       description_ru,
//       kg,
//       category,
//       sizes: parseJSON(sizes),
//       important: parseJSON(important),
//       characteristics: parseJSON(characteristics),
//       technical_structure: parseJSON(technical_structure)
//     };

//     // Find the product by ID and update it
//     const product = await productModel.findById(productId);
//     if (!product) return res.status(404).send({ error: "Produsul nu a fost găsit." });

//     // Update the product fields
//     for (const [key, value] of Object.entries(updatedData)) {
//       product[key] = value;
//     }

//     // Handling photo
//     if (photo) {
//       product.photo.data = fs.readFileSync(photo.path);
//       product.photo.contentType = photo.type;
//     }

//     // Save the updated product to the database
//     await product.save();

//     // Send a response back to the client
//     res.status(200).send({
//       success: true,
//       message: "Produsul a fost actualizat cu succes.",
//       product
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({
//       success: false,
//       message: "Eroare la actualizarea produsului.",
//       error: error.message
//     });
//   }
// };
export const updateProductController = async (req, res) => {
  try {
    const {
      name_ro, name_ru,
      description_ro, description_ru,
      category,
      sizes,
      kg,
      important,
      characteristics,
      technical_structure
    } = req.fields;
    const { photo } = req.files;
    const productSlug = req.params.slug; // Folosim slug-ul din parametrii rutei

    // Validare
    if (!name_ro || !name_ru) return res.status(400).send({ error: "Numele este necesar în ambele limbi." });
    if (!description_ro || !description_ru) return res.status(400).send({ error: "Descrierea este necesară în ambele limbi." });
    if (!category) return res.status(400).send({ error: "Categoria este obligatorie." });
    if (photo && photo.size > 1000000) return res.status(400).send({ error: "Fotografia trebuie să fie mai mică de 1MB." });

    // Parsează câmpurile JSON
    const parseJSON = (input) => {
      try {
        return JSON.parse(input);
      } catch (e) {
        return [];
      }
    };

    const updatedData = {
      name_ro,
      name_ru,
      slug: slugify(name_ro), // Asigură-te că slugify este configurat corespunzător pentru a genera slug-uri unice
      description_ro,
      description_ru,
      kg,
      category,
      sizes: parseJSON(sizes),
      important: parseJSON(important),
      characteristics: parseJSON(characteristics),
      technical_structure: parseJSON(technical_structure)
    };

    // Caută produsul după slug și actualizează-l
    const product = await productModel.findOne({ slug: productSlug });
    if (!product) return res.status(404).send({ error: "Produsul nu a fost găsit." });

    // Actualizează câmpurile produsului
    Object.assign(product, updatedData);

    // Manipulare foto
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    // Salvează produsul actualizat în baza de date
    await product.save();

    // Trimite răspunsul la client
    res.status(200).send({
      success: true,
      message: "Produsul a fost actualizat cu succes.",
      product
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Eroare la actualizarea produsului.",
      error: error.message
    });
  }
};


//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate('category') // Asigură-te că 'Category' este numele corect al modelului pentru populating
      .select('-photo') // Excludem poza din datele returnate pentru eficiență
      .limit(100)
      .sort({ createdAt: -1 }); // Sortăm produsele de la cel mai recent la cel mai vechi
    
    res.status(200).send({
      success: true,
      countTotal: products.length, // Corectat de la counTotal la countTotal
      message: "All Products", // Corectat spațiul și majusculele pentru consistență
      products,
    });
  } catch (error) {
    console.error(error); // Modificat de la log la error pentru a fi mai consistent cu gestionarea erorilor
    res.status(500).send({
      success: false,
      message: "Error in getting products", // Corectat de la Erorr la Error
      error: error.message,
    });
  }
};

// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

// // get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findOne({ slug: req.params.slug }).select("photo");
    if (product && product.photo && product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
    return res.status(404).send({ message: "Photo not found." });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error: error.message,
    });
  }
};


//delete controller
export const deleteProductController = async (req, res) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(req.params.pid);
    if (!deletedProduct) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error: error.message, // Este mai sigur să trimiți doar mesajul erorii
    });
  }
};

// filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) {
      args.kg = { $gte: radio[0], $lte: radio[1] };
    }
    const products = await productModel.find(args).populate('category');
    res.status(200).send({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: "Error While Filtering Products", error });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};
// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 100;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};
// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};
// similar products
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

// get products by category
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    if (!category) {
      // Dacă categoria nu este găsită, returnează un răspuns 404
      return res.status(404).send({
        success: false,
        message: "Category not found"
      });
    }
    const products = await productModel.find({ category: category._id }).populate("category");
    
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.error(error); // Mai bine să folosești console.error aici
    res.status(500).send({ // Codul de stare 500 este pentru erorile de server
      success: false,
      message: "Error while getting products",
      error: error.message, // Trimite doar mesajul erorii, nu întreg obiectul de eroare
    });
  }
};
