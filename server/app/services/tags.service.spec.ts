import { expect } from 'chai';
import { TagsInfo } from '../../../common/communication/tags';
import { TagsService } from './tags.service';

describe('Tags service', () => {
  const service: TagsService = new TagsService();

  it('should be logged in the coverage', (done: Mocha.Done) => {
    // tslint:disable-next-line: no-unused-expression
    expect(1).to.be.not.null;
    done();
  });

  it('should get the correct tags', () => {
    service.tags = [];
    const dummyTags: TagsInfo[] = [
      {
        id: 0,
        tagName: 'test0',
      },
      {
        id: 1,
        tagName: 'test1',
      },
    ];
    service.tags = dummyTags;
    expect(service.getTags()).to.equal(dummyTags);
  });

  it('should add one tag correctly', () => {
    service.tags = [];
    const dummytag: TagsInfo = {
      id: -1,
      tagName: 'test0',
    };
    const output = service.addTag(dummytag);
    expect(output.id).to.not.equal(-1);
    expect(output.tagName).to.equal('test0');
    expect(service.tags.length).to.equal(1);
  });

  it('should return a good table after manageNewTags', () => {
    service.tags = [
      {
        id: 0,
        tagName: 'test0',
      },
    ];
    const dummyTags: TagsInfo[] = [
      {
        id: -1,
        tagName: 'nouveau',
      },
    ];
    const output = service.manageNewTags(dummyTags);
    expect(output.length).to.equal(1);
    expect(service.tags.length).to.equal(2);
    expect(output[0].tagName).to.equal('nouveau');
    expect(output[0].id).to.not.equal(-1);
  });
});
