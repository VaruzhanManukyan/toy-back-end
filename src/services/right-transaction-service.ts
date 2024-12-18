import {Types} from "mongoose";
import ApiError from "../exceptions/api-error";

import {IRightTransactionRequest, IRightTransactionDB, IPersonageObjStateAllInfo} from "../shared/interfaces/right-transaction-interfaces";
import {IPersonageObjectState, IPersonageObjectStateDB} from "../shared/interfaces/personage-object-state-interfaes";
import {IScenarioDB} from "../shared/interfaces/scenario-interfaces";
import {IToyTypeDB} from "../shared/interfaces/toy-type-interfaces";
import {IDeviceDB} from "../shared/interfaces/device-interfaces";
import {ISupplierDB} from "../shared/interfaces/supplier-interfaces";
import {IUserDB} from "../shared/interfaces/user-interfaces";
import {IPublisherDB} from "../shared/interfaces/publisher-interfaces";
import {IDescriptionStateDB} from "../shared/interfaces/description-state-interfaces";

import PublisherModel from "../models/publisher-model";
import ScenarioModel from "../models/scenario-model";
import UserModel from "../models/user-model";
import DeviceModel from "../models/device-model";
import deviceModel from "../models/device-model";
import AudioFileModel from "../models/audio-file-model";
import PersonageObjectStateModel from "../models/personage-object-state-model";
import PersonageObjectModel from "../models/personage-object-model";
import DescriptionStateModel from "../models/description-state-model";
import ToyTypeModel from "../models/toy-type-model";
import RightTransactionModel from "../models/right-transaction-model";
import supplierModel from "../models/supplier-model";
import SupplierModel from "../models/supplier-model";

class RightTransactionService {
    private isUser(buyer: IUserDB | IDeviceDB): buyer is IUserDB {
        return (buyer as IUserDB)._doc.email !== undefined;
    }

    async create(rightTransaction: IRightTransactionRequest): Promise<IRightTransactionDB> {
        try {
            const { buyer_id, device_id, scenario_id } = rightTransaction;

            const buyer: IUserDB | IDeviceDB | null = await UserModel.findById(buyer_id) || await DeviceModel.findById(buyer_id);
            if (!buyer) {
                throw ApiError.BadRequest(`Buyer with id ${buyer_id} not found.`);
            }

            const scenario: IScenarioDB | null = await ScenarioModel.findById(scenario_id);
            if (!scenario) {
                throw ApiError.BadRequest(`Scenario with id ${scenario_id} not found.`);
            }

            const buyerInfo: string = this.isUser(buyer) ? buyer._doc.email : buyer._doc.serial_number;

            const personage_object_state_all_info: IPersonageObjStateAllInfo[] = [];
            const personage_object_state_ids: Types.ObjectId[] = scenario._doc.personage_object_state_ids;
            for (const personage_object_state_id of personage_object_state_ids) {
                const toyType: IToyTypeDB | null = await ToyTypeModel.findOne({ personage_object_state_id: personage_object_state_id });
                if (!toyType) {
                    throw ApiError.BadRequest("This personage object state does not have a toy type.");
                }

                const toyTypeSupplier: ISupplierDB | null = await SupplierModel.findById(toyType._doc.supplier_id);
                if (!toyTypeSupplier) {
                    throw ApiError.BadRequest("This toy type does not have a supplier.");
                }

                const personageObjectState: IPersonageObjectState | null = await PersonageObjectStateModel.findById(personage_object_state_id);
                if (!personageObjectState) {
                    throw ApiError.BadRequest(`Personage object state with id ${personage_object_state_id} not found.`);
                }

                const personageObject: IPersonageObjectStateDB | null = await PersonageObjectModel.findById(personageObjectState.personage_object_id);
                if (!personageObject) {
                    throw ApiError.BadRequest(`Personage object with id ${personageObjectState.personage_object_id} not found.`);
                }

                const description_state_ids: Types.ObjectId[] = personageObjectState.description_state_ids;
                const descriptionStates: string[] = [];
                for (const description_state_id of description_state_ids) {
                    const descriptionStateDB: IDescriptionStateDB | null = await DescriptionStateModel.findById(description_state_id);
                    if (!descriptionStateDB) {
                        throw ApiError.BadRequest(`Description state with id ${description_state_id} not found.`);
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

            const usersDB: IUserDB[] = await UserModel.find({ device_ids: { $in: device_id } });
            const userEmails: string[] = usersDB.map((user: IUserDB) => user._doc.email);

            const device: IDeviceDB | null = await deviceModel.findById(device_id);
            if (!device) {
                throw ApiError.BadRequest(`Device with id ${device_id} not found.`);
            }

            const publisher: IPublisherDB | null = await PublisherModel.findOne({ scenario_ids: scenario_id });
            if (!publisher) {
                throw ApiError.BadRequest(`This scenario has no publisher.`);
            }

            const audioFiles: string[] = [];
            for (const audio_file_id of scenario._doc.audio_file_ids) {
                const audioFile = await AudioFileModel.findById(audio_file_id);
                if (!audioFile) {
                    throw ApiError.BadRequest(`AudioFile with id ${audio_file_id} not found.`);
                }
                audioFiles.push(audioFile._doc.name);
            }

            const deviceSupplier: ISupplierDB | null = await supplierModel.findById(device._doc.supplier_id);
            if (!deviceSupplier) {
                throw ApiError.BadRequest(`Supplier with id ${device._doc.supplier_id} not found.`);
            }

            const rightTransactionDB = new RightTransactionModel({
                buyer: buyerInfo,
                users: userEmails,
                device_supplier: deviceSupplier._doc.email,
                serial_number: device._doc.serial_number,
                publisher: publisher._doc.name,
                scenario: scenario._doc.name,
                audio_files: audioFiles,
                personage_object_state_all_info: personage_object_state_all_info,
            });

            await rightTransactionDB.save();
            return rightTransactionDB;
        } catch (error) {
            throw error;
        }
    }

    async getAll(): Promise<IRightTransactionDB[]> {
        const rightTransactionsDB: IRightTransactionDB[] = await RightTransactionModel.find();
        return rightTransactionsDB;
    }

    async getById(id: Types.ObjectId): Promise<IRightTransactionDB> {
        const rightTransactionDB: IRightTransactionDB | null = await RightTransactionModel.findById(id);
        if (!rightTransactionDB) {
            throw ApiError.BadRequest(`Right transaction with id ${id} not found.`);
        }
        return rightTransactionDB;
    }
}

export default new RightTransactionService();