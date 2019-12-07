import { Binary } from 'bson';
import {Metadata} from './metadata';

export class Image {
    metadata: Metadata;
    data: Binary;
    path: string;

    constructor(path: string, metadata?: Metadata | undefined) {
        this.path = path;
        if (metadata) {
            this.metadata = metadata;
        }
    }
}
