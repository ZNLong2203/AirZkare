import { Request, Response, NextFunction} from 'express';
import { Passenger } from '../interfaces/passsenger.interface';
import { User } from '../interfaces/user.interface';
import PassengerService from '../services/passenger.service';

class PassengerController {
    public passengerService = new PassengerService();

    public getPassenger = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user_id } = req.params;
            const findPassenger = await this.passengerService.getPassenger(user_id);

            res.status(200).json({
                message: 'Passengers fetched successfully',
                data: findPassenger,
            })
        } catch(err) {
            next(err);
        }
    }

    public getAllPassenger = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const findAllPassenger = await this.passengerService.getAllPassenger();

            res.status(200).json({
                message: 'Passengers fetched successfully',
                data: findAllPassenger,
            })
        } catch(err) {
            next(err);
        }
    }

    public updatePassenger = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user_id } = req.params;
            const passengerData: Passenger = req.body;

            const updatePassenger = await this.passengerService.updatePassenger(user_id, passengerData);

            res.status(200).json({
                message: 'Passenger updated successfully',
                data: updatePassenger,
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