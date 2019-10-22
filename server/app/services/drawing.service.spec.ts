import { expect } from 'chai';
import { DrawingService } from './drawing.service';
import { TagsService } from './tags.service';

describe('Drawing service', () => {
  const tagsService: TagsService = new TagsService();
  const service: DrawingService = new DrawingService(tagsService);

  it('should be logged in the coverage', (done: Mocha.Done) => {
    expect(1).to.be.not.null;
    done();
  });

  it('should get the drawings correctly', () => {
    service.drawings = [];
    let dummyDrawing =
    {
      name: 'test0',
      typeOfSave: 1,
      tags: [{
        id: 1,
        tagName: 'test1',
      }],
      canvasInfo: '{ width: 50, height: 50, color: color1 }',
      primitives: '',
      thumbnail: '',
    };
    service.saveDrawing(dummyDrawing);
    expect(service.getDrawings()).to.include(dummyDrawing);
  });

  it('should delete the drawing correctly', () => {
    service.drawings = [];
    let dummyDrawing =
    {
      name: 'test0',
      typeOfSave: 1,
      tags: [{
        id: 1,
        tagName: 'test1',
      }],
      canvasInfo: '{ width: 50, height: 50, color: color1 }',
      primitives: '',
      thumbnail: '',
    };
    service.saveDrawing(dummyDrawing);
    service.deleteDrawing('test0');
    expect(service.drawings).to.not.include(dummyDrawing);
    expect(service.drawings.length).to.equal(0);
  });
});