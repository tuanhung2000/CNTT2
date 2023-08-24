const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema({
    userID: {
        type: String,
    },
    amount: {
        type: Number,
        default: 0,
    }
});

module.exports = mongoose.model("Wallet", WalletSchema);
