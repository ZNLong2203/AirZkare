import { Request, Response, NextFunction} from 'express';
import { Passenger } from '../interfaces/passsenger.interface';
import { User } from '../interfaces/user.interface';
import PassengerService from '../services/passenger.service';

class PassengerController {
    public passengerService = new PassengerService();

    public getPassengerInfo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user_id } = req.params;
            const findPassenger = await this.passengerService.getPassengerInfo(user_id);

            res.status(200).json({
                message: 'Passengers fetched successfully',
                metadata: findPassenger,
            })
        } catch(err) {
            next(err);
        }
    }

    public getAllPassenger = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page } = req.query
            const pageNumber = parseInt(page as string) | 1;

            const findAllPassenger = await this.passengerService.getAllPassenger(pageNumber);

            res.status(200).json({
                message: 'Passengers fetched successfully',
                metadata: findAllPassenger,
            })
        } catch(err) {
            next(err);
        }
    }

    public updatePassenger = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user_id } = req.params;
            const passengerData = req.body;

            const updatePassenger = await this.passengerService.updatePassenger(user_id, passengerData);

            res.status(200).json({
                message: 'Passenger updated successfully',
                metadata: updatePassenger,
            })
        } catch(err) {
            next(err);
        }
    }

    public deletePassenger = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user_id } = req.params;

            await this.passengerService.deletePassenger(user_id);

            res.status(200).json({
                message: 'Passenger deleted successfully',
            })
        } catch(err) {
            next(err);
        }
    }
}

export default PassengerController;