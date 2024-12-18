"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const device_controller_1 = __importDefault(require("../controllers/device-controller"));
const router = (0, express_1.Router)();
router.post("/create", device_controller_1.default.create);
router.post("/", device_controller_1.default.getAll);
router.post("/read", device_controller_1.default.getById);
router.post("/update", device_controller_1.default.update);
router.post("/delete", device_controller_1.default.delete);
router.post("/deleteMany", device_controller_1.default.deleteMany);
router.post("/connect", device_controller_1.default.connect);
exports.default = router;
