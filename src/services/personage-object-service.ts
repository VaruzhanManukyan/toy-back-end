import {Types} from "mongoose";
import ApiError from "../exceptions/api-error";
import {IPersonageObject, IPersonageObjectDB} from "../shared/interfaces/personage-object-interfaces";
import PersonageObjectModel from "../models/personage-object-model";
import PersonageObjectStateModel from "../models/personage-object-state-model";

class PersonageObjectService {
    async create(personageObject: IPersonageObject): Promise<IPersonageObjectDB> {
        try {
            const candidateWithName: IPersonageObjectDB | null = await PersonageObjectModel.findOne({name: personageObject.name});
            if (candidateWithName) {
                throw ApiError.BadRequest(`Personage object with this name ${personageObject.name} already exists.`);
            }

            const personageObjectDB = new PersonageObjectModel(personageObject);
            await personageObjectDB.save();
            return personageObjectDB;
        } catch (error) {
            throw error;
        }
    }

    async getAll(): Promise<IPersonageObjectDB[]> {
        try {
            const personageObjectsDB: IPersonageObjectDB[] = await PersonageObjectModel.find();
            return personageObjectsDB;
        } catch (error) {
            throw error;
        }
    }

    async getById(id: Types.ObjectId): Promise<IPersonageObjectDB> {
        try {
            const personageObjectDB: IPersonageObjectDB | null = await PersonageObjectModel.findById(id);

            if (!personageObjectDB) {
                throw ApiError.NotFound(`Personage object with id ${id} not found.`);
            }

            return personageObjectDB;
        } catch (error) {
            throw error;
        }
    }

    async update(id: Types.ObjectId, personageObject: IPersonageObject): Promise<IPersonageObjectDB> {
        try {
            const candidateWithName: IPersonageObjectDB | null = await PersonageObjectModel.findOne({name: personageObject.name});
            if (candidateWithName && id.toString() !== candidateWithName._id.toString()) {
                throw ApiError.BadRequest(`Personage object with this name ${name} already exists.`);
            }

            const personageObjectDB: IPersonageObjectDB | null = await PersonageObjectModel.findOneAndUpdate(
                {_id: id},
                {$set: personageObject},
                {new: true}
            );

            if (!personageObjectDB) {
                throw ApiError.NotFound(`Personage object with id ${id} not found.`);
            }

            return personageObjectDB;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: Types.ObjectId): Promise<string> {
        try {
            await PersonageObjectStateModel.deleteMany({ personage_object_id: id });

            const result = await PersonageObjectModel.deleteOne({ _id: id });

            if (result.deletedCount === 0) {
                throw ApiError.NotFound(`Personage object with id ${id} not found.`);
            }

            return "Personage object and its related states have been deleted.";
        } catch (error) {
            throw error;
        }
    }

    async deleteMany(ids: Types.ObjectId[]): Promise<string> {
        try {
            await PersonageObjectStateModel.deleteMany({ personage_object_id: { $in: ids } });

            const result = await PersonageObjectModel.deleteMany({ _id: { $in: ids } });

            if (result.deletedCount === 0) {
                throw ApiError.NotFound(`No Personage objects found for the provided ids.`);
            }

            return "Personage objects and their related states have been deleted.";
        } catch (error) {
            throw error;
        }
    }
}

export default new PersonageObjectService();