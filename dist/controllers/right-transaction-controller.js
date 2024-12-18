"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const right_transaction_service_1 = __importDefault(require("../services/right-transaction-service"));
class RightTransactionController {
    create(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rightTransaction = {
                    buyer_id: request.body.buyer_id,
                    user_ids: request.body.user_ids,
                    device_id: request.body.device_id,
                    scenario_id: request.body.scenario_id,
                };
                const rightTransactionDB = yield right_transaction_service_1.default.create(rightTransaction);
                const rightTransactionResponse = {
                    id: rightTransactionDB._id,
                    buyer: rightTransactionDB._doc.buyer,
                    users: rightTransactionDB._doc.users,
                    serial_number: rightTransactionDB._doc.serial_number,
                    scenario: rightTransactionDB._doc.scenario,
                    audio_files: rightTransactionDB._doc.audio_files,
                    device_supplier: rightTransactionDB._doc.device_supplier,
                    publisher: rightTransactionDB._doc.publisher,
                    personage_object_state_all_info: rightTransactionDB._doc.personage_object_state_all_info
                };
                response.status(201).json(rightTransactionResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAll(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rightTransactionsDB = yield right_transaction_service_1.default.getAll();
                const rightTransactionsResponse = {
                    data: rightTransactionsDB.map(item => (Object.assign({ id: item._id }, item._doc))),
                    total: rightTransactionsDB.length
                };
                response.status(200).json(rightTransactionsResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getById(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.body;
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${id}`));
                }
                const rightTransactionDB = yield right_transaction_service_1.default.getById(id);
                if (!rightTransactionDB) {
                    return next(api_error_1.default.NotFound(`Right Transaction not found with ID: ${id}`));
                }
                const rightTransactionResponse = {
                    id: rightTransactionDB._id,
                    buyer: rightTransactionDB._doc.buyer,
                    users: rightTransactionDB._doc.users,
                    serial_number: rightTransactionDB._doc.serial_number,
                    scenario: rightTransactionDB._doc.scenario,
                    audio_files: rightTransactionDB._doc.audio_files,
                    device_supplier: rightTransactionDB._doc.device_supplier,
                    publisher: rightTransactionDB._doc.publisher,
                    personage_object_state_all_info: rightTransactionDB._doc.personage_object_state_all_info
                };
                response.status(200).json(rightTransactionResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new RightTransactionController();
