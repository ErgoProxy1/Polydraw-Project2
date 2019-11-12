import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { TagsService } from '../services/tags.service';
import Types from '../types';

@injectable()
export class TagsController {
  router: Router;

  constructor(@inject(Types.TagsService) private tagsService: TagsService) {
    this.configureRouter();
  }

  private configureRouter(): void {
    this.router = Router();

    this.router.get('/',
      (req: Request, res: Response) => {
        const msg = this.tagsService.getTags();
        res.json(msg);
      });
  }
}
