import { Container } from 'inversify';
import { Application } from './app';
import { DrawingController } from './controllers/drawing.controller';
import {FirebaseController} from './controllers/firebase.controller';
import { MongoController } from './controllers/mongo.controller';
import { TagsController } from './controllers/tags.controller';
import { Server } from './server';
import { DrawingService } from './services/drawing.service';
import {FirebaseService} from './services/firebase.service';
import {MongoService} from './services/mongo.service';
import { TagsService } from './services/tags.service';
import Types from './types';

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);

container.bind(Types.DrawingController).to(DrawingController);
container.bind(Types.DrawingService).to(DrawingService);

container.bind(Types.TagsController).to(TagsController);
container.bind(Types.TagsService).to(TagsService);

container.bind(Types.MongoService).to(MongoService);
container.bind(Types.MongoController).to(MongoController);

container.bind(Types.FirebaseService).to(FirebaseService);
container.bind(Types.FirebaseController).to(FirebaseController);

export { container };
