import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import {FirebaseService} from '../services/firebase.service';
import Types from '../types';

@injectable()
export class FirebaseController {

    router: Router;
    readonly storageDirName: string = 'images';
    readonly dataName: string = 'drawings.json';

    constructor(
      @inject(Types.FirebaseService) private storageService: FirebaseService) {
      this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/images', async (req: Request, res: Response, next: NextFunction) => {
            this.storageService.downloadImage(this.storageDirName, this.dataName)
                .then(() => {
                //
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
            });
        });

        this.router.get('/images/:tag', async (req: Request, res: Response, next: NextFunction) => {
            this.storageService.downloadImage(this.storageDirName, this.dataName)
                .then(() => {
                //
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
            });
        });

        this.router.post('/images/', async (req: Request, res: Response, next: NextFunction) => {
            this.storageService.addImageBinary(req.body, this.dataName)
                .then(() => {
                    res.sendStatus(Httpstatus.CREATED).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });
}
}
