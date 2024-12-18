"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supplier_controller_1 = __importDefault(require("../controllers/supplier-controller"));
const router = (0, express_1.Router)();
router.post("/create", supplier_controller_1.default.create);
router.post("/", supplier_controller_1.default.getAll);
router.post("/read", supplier_controller_1.default.getById);
router.post("/update", supplier_controller_1.default.update);
router.post("/delete", supplier_controller_1.default.delete);
router.post("/deleteMany", supplier_controller_1.default.deleteMany);
exports.default = router;
