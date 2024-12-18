"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const toy_controller_1 = __importDefault(require("../controllers/toy-controller"));
const router = (0, express_1.Router)();
router.post("/create", toy_controller_1.default.create);
router.post("/", toy_controller_1.default.getAll);
router.post("/read", toy_controller_1.default.getById);
router.post("/update", toy_controller_1.default.update);
router.post("/delete", toy_controller_1.default.delete);
router.post("/deleteMany", toy_controller_1.default.deleteMany);
exports.default = router;
