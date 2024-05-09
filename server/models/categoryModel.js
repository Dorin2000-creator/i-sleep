    import mongoose from "mongoose";

    const categorySchema = new mongoose.Schema({
        nameRo: { // Numele categoriei în română
            type: String,
            required: true,
            unique: true
        },
        nameRu: { // Numele categoriei în rusă
            type: String,
            required: true,
            unique: true
        },
        slug: { // Slug-ul în română
            type: String,
            lowercase: true,
            unique: true
        },
       
    });

    export default mongoose.model('Category', categorySchema);