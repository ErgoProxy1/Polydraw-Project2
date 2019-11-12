import { expect } from 'chai';
import { DrawingService } from './drawing.service';
import { TagsService } from './tags.service';

describe('Drawing service', () => {
  const tagsService: TagsService = new TagsService();
  const service: DrawingService = new DrawingService(tagsService);

  it('should be logged in the coverage', (done: Mocha.Done) => {
    // tslint:disable-next-line: no-unused-expression
    expect(1).to.be.not.null;
    done();
  });

  it('should get the drawings correctly', () => {
    service.drawings = [];
    const dummyDrawing0 = {
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
    const dummyDrawing1 = {
      name: 'test1',
      typeOfSave: 1,
      tags: [{
        id: 1,
        tagName: 'test1',
      }],
      canvasInfo: '{ width: 50, height: 50, color: color1 }',
      primitives: '',
      thumbnail: '',
    };
    const dummyDrawing2 = {
      name: 'test2',
      typeOfSave: 1,
      tags: [{
        id: 1,
        tagName: 'test1',
      }],
      canvasInfo: '{ width: 50, height: 50, color: color1 }',
      primitives: '',
      thumbnail: '',
    };
    service.saveDrawing(dummyDrawing0);
    service.saveDrawing(dummyDrawing1);
    service.saveDrawing(dummyDrawing2);
    expect(service.getDrawings()).to.include(dummyDrawing0);
    expect(service.getDrawings()).to.include(dummyDrawing1);
    expect(service.getDrawings()).to.include(dummyDrawing2);
  });

  it('should delete the drawing correctly', () => {
    service.drawings = [];
    const dummyDrawing0 = {
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
    const dummyDrawing1 = {
      name: 'test1',
      typeOfSave: 1,
      tags: [{
        id: 1,
        tagName: 'test1',
      }],
      canvasInfo: '{ width: 50, height: 50, color: color1 }',
      primitives: '',
      thumbnail: '',
    };
    const dummyDrawing2 = {
      name: 'test2',
      typeOfSave: 1,
      tags: [{
        id: 1,
        tagName: 'test1',
      }],
      canvasInfo: '{ width: 50, height: 50, color: color1 }',
      primitives: '',
      thumbnail: '',
    };
    service.saveDrawing(dummyDrawing0);
    service.saveDrawing(dummyDrawing1);
    service.saveDrawing(dummyDrawing2);
    service.deleteDrawing(dummyDrawing0);
    expect(service.drawings).to.not.include(dummyDrawing0);
    expect(service.drawings.length).to.equal(2);
  });
});
