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
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const publisher_model_1 = __importDefault(require("../models/publisher-model"));
const scenario_model_1 = __importDefault(require("../models/scenario-model"));
const user_model_1 = __importDefault(require("../models/user-model"));
const device_model_1 = __importDefault(require("../models/device-model"));
const device_model_2 = __importDefault(require("../models/device-model"));
const audio_file_model_1 = __importDefault(require("../models/audio-file-model"));
const personage_object_state_model_1 = __importDefault(require("../models/personage-object-state-model"));
const personage_object_model_1 = __importDefault(require("../models/personage-object-model"));
const description_state_model_1 = __importDefault(require("../models/description-state-model"));
const toy_type_model_1 = __importDefault(require("../models/toy-type-model"));
const right_transaction_model_1 = __importDefault(require("../models/right-transaction-model"));
const supplier_model_1 = __importDefault(require("../models/supplier-model"));
const supplier_model_2 = __importDefault(require("../models/supplier-model"));
class RightTransactionService {
    isUser(buyer) {
        return buyer._doc.email !== undefined;
    }
    create(rightTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { buyer_id, device_id, scenario_id } = rightTransaction;
                const buyer = (yield user_model_1.default.findById(buyer_id)) || (yield device_model_1.default.findById(buyer_id));
                if (!buyer) {
                    throw api_error_1.default.BadRequest(`Buyer with id ${buyer_id} not found.`);
                }
                const scenario = yield scenario_model_1.default.findById(scenario_id);
                if (!scenario) {
                    throw api_error_1.default.BadRequest(`Scenario with id ${scenario_id} not found.`);
                }
                const buyerInfo = this.isUser(buyer) ? buyer._doc.email : buyer._doc.serial_number;
                const personage_object_state_all_info = [];
                const personage_object_state_ids = scenario._doc.personage_object_state_ids;
                for (const personage_object_state_id of personage_object_state_ids) {
                    const toyType = yield toy_type_model_1.default.findOne({ personage_object_state_id: personage_object_state_id });
                    if (!toyType) {
                        throw api_error_1.default.BadRequest("This personage object state does not have a toy type.");
                    }
                    const toyTypeSupplier = yield supplier_model_2.default.findById(toyType._doc.supplier_id);
                    if (!toyTypeSupplier) {
                        throw api_error_1.default.BadRequest("This toy type does not have a supplier.");
                    }
                    const personageObjectState = yield personage_object_state_model_1.default.findById(personage_object_state_id);
                    if (!personageObjectState) {
                        throw api_error_1.default.BadRequest(`Personage object state with id ${personage_object_state_id} not found.`);
                    }
                    const personageObject = yield personage_object_model_1.default.findById(personageObjectState.personage_object_id);
                    if (!personageObject) {
                        throw api_error_1.default.BadRequest(`Personage object with id ${personageObjectState.personage_object_id} not found.`);
                    }
                    const description_state_ids = personageObjectState.description_state_ids;
                    const descriptionStates = [];
                    for (const description_state_id of description_state_ids) {
                        const descriptionStateDB = yield description_state_model_1.default.findById(description_state_id);
                        if (!descriptionStateDB) {
                            throw api_error_1.default.BadRequest(`Description state with id ${description_state_id} not found.`);
                        }
                        descriptionStates.push(descriptionStateDB._doc.name);
                    }
                    personage_object_state_all_info.push({
                        toy_type_supplier: toyTypeSupplier._doc.name,
                        toy_type: toyType._doc.name,
                        personage_object_state: personageObjectState.name,
                        personage_object: personageObject._doc.name,
                        description_states: descriptionStates,
                    });
                }
                const usersDB = yield user_model_1.default.find({ device_ids: { $in: device_id } });
                const userEmails = usersDB.map((user) => user._doc.email);
                const device = yield device_model_2.default.findById(device_id);
                if (!device) {
                    throw api_error_1.default.BadRequest(`Device with id ${device_id} not found.`);
                }
                const publisher = yield publisher_model_1.default.findOne({ scenario_ids: scenario_id });
                if (!publisher) {
                    throw api_error_1.default.BadRequest(`This scenario has no publisher.`);
                }
                const audioFiles = [];
                for (const audio_file_id of scenario._doc.audio_file_ids) {
                    const audioFile = yield audio_file_model_1.default.findById(audio_file_id);
                    if (!audioFile) {
                        throw api_error_1.default.BadRequest(`AudioFile with id ${audio_file_id} not found.`);
                    }
                    audioFiles.push(audioFile._doc.name);
                }
                const deviceSupplier = yield supplier_model_1.default.findById(device._doc.supplier_id);
                if (!deviceSupplier) {
                    throw api_error_1.default.BadRequest(`Supplier with id ${device._doc.supplier_id} not found.`);
                }
                const rightTransactionDB = new right_transaction_model_1.default({
                    buyer: buyerInfo,
                    users: userEmails,
                    device_supplier: deviceSupplier._doc.email,
                    serial_number: device._doc.serial_number,
                    publisher: publisher._doc.name,
                    scenario: scenario._doc.name,
                    audio_files: audioFiles,
                    personage_object_state_all_info: personage_object_state_all_info,
                });
                yield rightTransactionDB.save();
                return rightTransactionDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const rightTransactionsDB = yield right_transaction_model_1.default.find();
            return rightTransactionsDB;
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const rightTransactionDB = yield right_transaction_model_1.default.findById(id);
            if (!rightTransactionDB) {
                throw api_error_1.default.BadRequest(`Right transaction with id ${id} not found.`);
            }
            return rightTransactionDB;
        });
    }
}
exports.default = new RightTransactionService();
