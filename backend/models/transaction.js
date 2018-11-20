const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const Category = require("./categories");

// const setAmount = (val) => {
//     return val * 100;;
// }
//
// const getAmount = (val) => {
//     return (val / 100).toFixed(2);
// }

// this will be our data base's data structure
// const CategorySchema = new Schema({
//     label: String,
//     value: String
// });

// this will be our data base's data structure
const TransactionSchema = new Schema({
    date: {
        type: Date,
        default: Date.now,
        required: [true, 'date field is required']
    },
    message: {
        type: String,
        default: 'N/A'
    },
    category: String,
    amount: {
        type: String,
        // set: setAmount,
        // get: getAmount,
        required: [true, 'amount field is required']
    }
});

// will create a table called transactions in database.  will plural table all on its own
const Transaction = mongoose.model("transaction", TransactionSchema);

module.exports = Transaction;
