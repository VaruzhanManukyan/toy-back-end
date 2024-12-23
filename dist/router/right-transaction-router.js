"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const right_transaction_controller_1 = __importDefault(require("../controllers/right-transaction-controller"));
const router = (0, express_1.Router)();
router.post("/create", right_transaction_controller_1.default.create);
router.post("/", right_transaction_controller_1.default.getAll);
router.post("/read", right_transaction_controller_1.default.getById);
exports.default = router;
