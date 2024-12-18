"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const publisher_controller_1 = __importDefault(require("../controllers/publisher-controller"));
const router = (0, express_1.Router)();
router.post("/create", publisher_controller_1.default.create);
router.post("/", publisher_controller_1.default.getAll);
router.post("/read", publisher_controller_1.default.getById);
router.post("/update", publisher_controller_1.default.update);
router.post("/delete", publisher_controller_1.default.delete);
router.post("/deleteMany", publisher_controller_1.default.deleteMany);
exports.default = router;
