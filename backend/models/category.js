const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    value: 'string',
    text: String
});

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Category", CategorySchema);
