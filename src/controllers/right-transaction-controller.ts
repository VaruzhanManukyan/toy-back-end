import {Types} from "mongoose";
import ApiError from "../exceptions/api-error";
import {Request, Response, NextFunction} from "express";
import {IRightTransactionAllResponse, IRightTransactionResponse, IRightTransactionRequest, IRightTransactionDB} from "../shared/interfaces/right-transaction-interfaces";
import RightTransactionService from "../services/right-transaction-service";

class RightTransactionController {
    async create(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const rightTransaction: IRightTransactionRequest = {
                buyer_id: request.body.buyer_id,
                user_ids: request.body.user_ids,
                device_id: request.body.device_id,
                scenario_id: request.body.scenario_id,
            }

            const rightTransactionDB: IRightTransactionDB = await RightTransactionService.create(rightTransaction);

            const rightTransactionResponse: IRightTransactionResponse = {
                id: rightTransactionDB._id,
                buyer: rightTransactionDB._doc.buyer,
                users: rightTransactionDB._doc.users,
                serial_number: rightTransactionDB._doc.serial_number,
                scenario: rightTransactionDB._doc.scenario,
                audio_files: rightTransactionDB._doc.audio_files,
                device_supplier: rightTransactionDB._doc.device_supplier,
                publisher: rightTransactionDB._doc.publisher,
                personage_object_state_all_info: rightTransactionDB._doc.personage_object_state_all_info
            }

            response.status(201).json(rightTransactionResponse);
        } catch (error) {
            next(error);
        }
    }

    async getAll(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const rightTransactionsDB = await RightTransactionService.getAll();
            const rightTransactionsResponse: IRightTransactionAllResponse = {
                data: rightTransactionsDB.map(item => ({
                    id: item._id,
                    ...item._doc
                })),
                total: rightTransactionsDB.length
            }

            response.status(200).json(rightTransactionsResponse);
        } catch (error) {
            next(error);
        }
    }

    async getById(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = request.body;
            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${id}`));
            }

            const rightTransactionDB = await RightTransactionService.getById(id);
            if (!rightTransactionDB) {
                return next(ApiError.NotFound(`Right Transaction not found with ID: ${id}`));
            }

            const rightTransactionResponse: IRightTransactionResponse = {
                id: rightTransactionDB._id,
                buyer: rightTransactionDB._doc.buyer,
                users: rightTransactionDB._doc.users,
                serial_number: rightTransactionDB._doc.serial_number,
                scenario: rightTransactionDB._doc.scenario,
                audio_files: rightTransactionDB._doc.audio_files,
                device_supplier: rightTransactionDB._doc.device_supplier,
                publisher: rightTransactionDB._doc.publisher,
                personage_object_state_all_info: rightTransactionDB._doc.personage_object_state_all_info
            }

            response.status(200).json(rightTransactionResponse);
        } catch (error) {
            next(error);
        }
    }
}

export default new RightTransactionController();
