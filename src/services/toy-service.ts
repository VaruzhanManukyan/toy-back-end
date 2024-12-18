import {Types} from "mongoose";
import ApiError from "../exceptions/api-error";
import {IToy, IToyDB} from "../shared/interfaces/toy-interfaces";
import ToyModel from "../models/toy-model";

class ToyService {
    async create(toy: IToy): Promise<IToyDB> {
        const {RFID} = toy;
        const candidateWithRFID = await ToyModel.findOne({RFID});
        if (candidateWithRFID) {
            throw ApiError.BadRequest(`Toy with this RFID ${RFID} already exists.`);
        }

        const toyDB = new ToyModel(toy);
        await toyDB.save();
        return toyDB;
    }

    async getAll(): Promise<IToyDB[]> {
        const toysDB: IToyDB[] = await ToyModel.find();
        return toysDB;
    }

    async getById(id: Types.ObjectId): Promise<IToyDB> {
        const toysDB: IToyDB | null = await ToyModel.findById(id);
        if (!toysDB) {
            throw ApiError.BadRequest(`Toy with id ${id} not found.`);
        }
        return toysDB;
    }

    async update(id: Types.ObjectId, toy: IToy) {
        const { RFID } = toy;
        const candidateWithRFID = await ToyModel.findOne({ RFID });

        if (candidateWithRFID && id.toString() !== candidateWithRFID._id.toString()) {
            throw ApiError.BadRequest(`Toy with this RFID ${RFID} already exists.`);
        }

        const toyDB: IToyDB | null = await ToyModel.findByIdAndUpdate(
            id,
            { $set: toy },
            { new: true }
        );

        if (!toyDB) {
            throw ApiError.BadRequest(`Toy with id ${id.toString()} not found.`);
        }

        return toyDB;
    }

    async delete(id: Types.ObjectId): Promise<string> {
        try {
            const result = await ToyModel.deleteOne({_id: id});
            if (result.deletedCount === 0) {
                throw ApiError.BadRequest(`No Toy found for the provided IDs.`);
            }
            return `${result.deletedCount} Toy deleted successfully.`;
        } catch (error) {
            throw error;
        }
    }

    async deleteMany(ids: Types.ObjectId[]): Promise<string> {
        try {
            const result = await ToyModel.deleteMany({_id: {$in: ids}});
            if (result.deletedCount === 0) {
                throw ApiError.BadRequest(`No Toys found for the provided IDs.`);
            }
            return `${result.deletedCount} Toys deleted successfully.`;
        } catch (error) {
            throw error;
        }
    }
}

export default new ToyService();
