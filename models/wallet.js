const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema({
    userID: {
        type: String,
    },
    amount: {
        type: Number,
        default: 0,
    },
    currency: {
        type: String
    }
});

module.exports = mongoose.model("Wallet", WalletSchema);
