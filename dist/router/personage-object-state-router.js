"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const personage_object_state_controller_1 = __importDefault(require("../controllers/personage-object-state-controller"));
const router = (0, express_1.Router)();
router.post("/create", personage_object_state_controller_1.default.create);
router.post("/", personage_object_state_controller_1.default.getAll);
router.post("/read", personage_object_state_controller_1.default.getById);
router.post("/update", personage_object_state_controller_1.default.update);
router.post("/delete", personage_object_state_controller_1.default.delete);
router.post("/deleteMany", personage_object_state_controller_1.default.deleteMany);
exports.default = router;
