import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { DrawingService } from '../services/drawing.service';
import Types from '../types';

@injectable()
export class DrawingController {

  router: Router;

  constructor(@inject(Types.DrawingService) private drawingService: DrawingService) {
    this.configureRouter();
  }

  private configureRouter(): void {
    this.router = Router();

    this.router.get('/',
      (req: Request, res: Response) => {
        const msg = this.drawingService.getDrawings();
        res.json(msg);
      });

    this.router.post('/save',
      (req: Request, res: Response) => {
        const msg = this.drawingService.saveDrawing(req.body.drawingInfo);
        res.json(msg);
      });

    this.router.post('/delete',
      (req: Request, res: Response) => {
        const msg = this.drawingService.deleteDrawing(req.body.drawingInfo);
        res.json(msg);
      });
  }
}
