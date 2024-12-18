"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user-controller"));
const router = (0, express_1.Router)();
router.post("/create", user_controller_1.default.create);
router.post("/", user_controller_1.default.getAll);
router.post("/read", user_controller_1.default.getById);
router.post("/update", user_controller_1.default.update);
router.post("/delete", user_controller_1.default.delete);
router.post("/deleteMany", user_controller_1.default.deleteMany);
exports.default = router;
