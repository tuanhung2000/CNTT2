const express = require("express");
const router = express.Router();
const {
    requestOrder,
    editOrder,
    deleteOrder,
    responseOrder,
    getAllOrder,
} = require("../controllers/order");

router.get("/all-orders", getAllOrder);

router.post("/requestOrder", requestOrder);

router.post("/responseOrder", responseOrder);

router.patch("/updateOrder", editOrder);

router.delete("/deleteOrder", deleteOrder);

module.exports = router;
