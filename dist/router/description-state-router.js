"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const description_state_controller_1 = __importDefault(require("../controllers/description-state-controller"));
const router = (0, express_1.Router)();
router.post("/create", description_state_controller_1.default.create);
router.post("/", description_state_controller_1.default.getAll);
router.post("/read", description_state_controller_1.default.getById);
router.post("/update", description_state_controller_1.default.update);
router.post("/delete", description_state_controller_1.default.delete);
router.post("/deleteMany", description_state_controller_1.default.deleteMany);
exports.default = router;
