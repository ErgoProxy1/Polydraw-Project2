export class Metadata {
    tag: string;
    createAt: Date;
    url: string;
    constructor(tag: string, createAt: Date, url: string, ) {
        this.tag = tag;
        this.createAt = createAt;
        this.url = url;
    }
}
