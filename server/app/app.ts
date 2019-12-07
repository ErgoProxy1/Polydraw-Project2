import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { inject, injectable } from 'inversify';
import * as logger from 'morgan';
import { DrawingController } from './controllers/drawing.controller';
import { FirebaseController } from './controllers/firebase.controller';
import { MongoController } from './controllers/mongo.controller';
import { TagsController } from './controllers/tags.controller';
import Types from './types';

@injectable()
export class Application {

  private readonly INTERNAL_ERROR: number = 500;
  app: express.Application;

  constructor(@inject(Types.DrawingController) private drawingController: DrawingController,
              @inject(Types.TagsController) private tagsController: TagsController,
              @inject(Types.FirebaseController) private firebaseController: FirebaseController,
              @inject(Types.MongoController) private mongoController: MongoController) {
    this.app = express();

    this.config();

    this.bindRoutes();
  }

  private config(): void {
    // Middlewares configuration
    this.app.use(logger('dev'));
    this.app.use(bodyParser.json({ limit: '100mb' }));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(cors());
  }

  bindRoutes(): void {
    // Notre application utilise le routeur de notre API `Index`
    this.app.use('/api/drawing', this.drawingController.router);
    this.app.use('/api/tags', this.tagsController.router);
    this.app.use('/api/drawing', this.mongoController.router);
    this.app.use('/api/drawing', this.firebaseController.router);
    this.errorHandling();
  }

  private errorHandling(): void {
    // When previous handlers have not served a request: path wasn't found
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      const err: Error = new Error('Not Found');
      next(err);
    });

    // development error handler
    // will print stacktrace
    if (this.app.get('env') === 'development') {
      this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(err.status || this.INTERNAL_ERROR);
        res.send({
          message: err.message,
          error: err,
        });
      });
    }

    // production error handler
    // no stacktraces leaked to user (in production env only)
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.status(err.status || this.INTERNAL_ERROR);
      res.send({
        message: err.message,
        error: {},
      });
    });
  }
}
