import { Container } from 'inversify';
import { Application } from './app';
import { Server } from './server';
import Types from './types';
import { DrawingController } from './controllers/drawing.controller';
import { DrawingService } from './services/drawing.service';
import { TagsController } from './controllers/tags.controller';
import { TagsService } from './services/tags.service';

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);

container.bind(Types.DrawingController).to(DrawingController);
container.bind(Types.DrawingService).to(DrawingService);

container.bind(Types.TagsController).to(TagsController);
container.bind(Types.TagsService).to(TagsService);

export { container };
