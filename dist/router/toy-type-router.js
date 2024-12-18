"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_image_config_1 = require("../config/multer-image-config");
const toy_type_controller_1 = __importDefault(require("../controllers/toy-type-controller"));
const router = (0, express_1.Router)();
router.post("/create", multer_image_config_1.multerUpload, toy_type_controller_1.default.create);
router.post("/", toy_type_controller_1.default.getAll);
router.post("/read", toy_type_controller_1.default.getById);
router.post("/update", multer_image_config_1.multerUpload, toy_type_controller_1.default.update);
router.post("/delete", toy_type_controller_1.default.delete);
router.post("/deleteMany", toy_type_controller_1.default.deleteMany);
router.post("/search/price", toy_type_controller_1.default.searchByPriceRange);
exports.default = router;
