import { injectable } from 'inversify';
import { Binary, Collection, FilterQuery, FindOneOptions, MongoClient, MongoClientOptions, UpdateQuery} from 'mongodb';
import 'reflect-metadata';
import {MONGO_DATABASE_COLLECTION, MONGO_DATABASE_NAME, MONGO_DATABASE_URL} from '../server-constants/serverConstants';
import { Image} from '../utils/image';
import { Metadata} from '../utils/metadata';
import { FileService } from './file.service';

@injectable()
export class MongoService {

    collection: Collection<Metadata>;
    fileService: FileService;

    private options: MongoClientOptions = {
        useNewUrlParser : true,
        useUnifiedTopology : true,
    };

    constructor() {

        MongoClient.connect(MONGO_DATABASE_URL, this.options)
            .then((client: MongoClient) => {
                this.collection = client.db(MONGO_DATABASE_NAME).collection(MONGO_DATABASE_COLLECTION);
            })
            .catch(() => {
                console.error('CONNECTION ERROR. EXITING PROCESS');
                process.exit(1);
            });
        this.fileService = new FileService();
    }

    async getAllImagesDatas(): Promise<Metadata[]> {
        return  this.collection.find({}).toArray()
                .then((images: Metadata[]) => {
                    return images;
                })
                .catch((error: Error) => {
                    throw error;
                });
    }

    async getImageData(tag: string): Promise<Metadata> {
        return  this.collection.findOne({tag})
                .then((metadata: any) => {
                    return metadata as Metadata;
                })
                .catch((error: Error) => {
                    throw error;
                });
    }

    async addMetadata(data: Metadata): Promise<void> {
        if (this.validateData(data)) {
            this.collection.insertOne(data).catch((error: Error) => {
                throw error;
            });
        } else {
            throw new Error('Invalid image');
        }
    }

    async deleteImage(tag: string): Promise<void> {
        return this.collection
            .findOneAndDelete({ tag })
        .then(() => {//
         })
        .catch((error: Error) => {
            throw new Error('Failed to delete image');
        });
    }

    async modifyData(image: Metadata): Promise<void> {
        const filterQuery: FilterQuery<Metadata> = { tag: image.tag};
        const updateQuery: UpdateQuery<Metadata> = {
            $set : { tag: image.tag,
                     createAt: image.createAt,
                     url: image.url,
                     },
        };
        this.collection.updateOne(filterQuery, updateQuery)
                              .then(() => {
                                  //
                              })
                              .catch(() => {
                                  throw new Error('Failed to update document');
                              });
    }

    async getImageTagByDate(date: Date): Promise<string[]> {
        const filterQuery: FilterQuery<Metadata> = {date};
        const projection: FindOneOptions = {projection: {tag : 1, id: 0}};
        return  this.collection.findOne(filterQuery, projection)
                .then((result: any) => result,
                    )
                .catch(() => {
                    throw new Error('Failed to get data');
                });
    }

    private validateData(data: Metadata): boolean {
        return this.validateTag(data.tag);
    }
    private validateTag(tag: string): boolean {
        return tag !== null;
    }

    async setImageData(image: Image): Promise<void> {
        this.fileService.readFile(image.path).then((buffer: Buffer) => {
            image.data = new Binary(buffer);
            this.addMetadata(image.metadata);
        });
    }

    async populateDB() {
        const paths = ['../../data/images/image1.bmp',
                        '../../data/images/image2.bmp',
                        '../../data/images/image3.bmp',
                        '../../data/drawings.json'];
        const images: Image[] = [
                            new Image(paths[0]),
                            new Image(paths[1]),
                            new Image(paths[2]),
                        ];
        images[0].metadata =  new Metadata('image1', new Date(Date.now()), 'url1');
        images[1].metadata =  new Metadata('image2', new Date(Date.now()), 'url2');
        images[2].metadata =  new Metadata('image3', new Date(Date.now()), 'url3');
        images[3].metadata =  new Metadata('imagesJson', new Date(Date.now()), 'url3');

        console.log('ADDING DATAS TO DATABASE ... ');

        images.forEach((item) => {
            this.setImageData(item);
        });
    }
}
