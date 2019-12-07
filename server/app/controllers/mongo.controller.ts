import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import {MongoService} from '../services/mongo.service';

import Types from '../types';
import { Metadata } from '../utils/metadata';

@injectable()
export class MongoController {

    router: Router;

    constructor(
      @inject(Types.MongoService) private databaseService: MongoService) {
      this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/images', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.getAllImagesDatas()
                .then((metadatas: Metadata[]) => {
                    res.json(metadatas);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/images/:tag', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.getImageData(req.params.tag)
                .then((metadata: Metadata) => {
                    res.json(metadata);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.post('/images/', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.addMetadata(req.body)
                .then(() => {
                    res.sendStatus(Httpstatus.CREATED).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.delete('/images/:tag', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.deleteImage(req.params.tag)
                .then(() => {
                    res.sendStatus(Httpstatus.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.patch('/images/', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.modifyData(req.body)
                .then(() => {
                    res.sendStatus(Httpstatus.OK);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/tags/:tag', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.getImageTagByDate(new Date(req.params.createAt))
                .then((tag: string[]) => {
                    res.send(tag);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        // Populate the database, call only once
        this.router.get('/populateDB', (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.populateDB();
            res.sendStatus(Httpstatus.OK);
        });
    }
}
