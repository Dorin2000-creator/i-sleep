import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  price: { type: Number, required: true }
});

const characteristicsSchema = new mongoose.Schema({
  key_ro: {type: String, required: true},
  key_ru: {type: String, required: true},
  value_ro: {type: String, required: true},
  value_ru: {type: String, required: true}
})

const importantSchema = new mongoose.Schema({
  importantspec_ro: {type: String, required: true},
  importantspec_ru: {type: String, required: true}
})

const technical_structureSchema = new mongoose.Schema({

  technical_structurespec_ro: {type: String, required: true},
  technical_structurespec_ru: {type: String, required: true}
})

const productSchema = new mongoose.Schema({
  name_ro: { type: String, required: true },
  name_ru: { type: String, required: true },
  slug: { type: String, required: true }, 
  description_ro: { type: String, required: true },
  description_ru: { type: String, required: true },
  kg:{type:Number, required: true },
  category: { type: mongoose.ObjectId, ref: 'Category', required: true },
  sizes: [sizeSchema],
  photo: { data: Buffer, contentType: String },
  important: [importantSchema],
  characteristics: [characteristicsSchema],
  technical_structure: [technical_structureSchema]
}, { timestamps: true });

export default mongoose.model("Products", productSchema);
