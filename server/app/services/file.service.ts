import * as fs from 'fs';
import * as util from 'util';

export class FileService {

    async readFile(filepath: string): Promise<Buffer> {
        return util.promisify(fs.readFile)(filepath);
    }

    async readFileInBase64(filepath: string): Promise<string> {
        const buffer: Buffer = await this.readFile(filepath);

        return buffer.toString('base64');
    }

    async writeFile(filepath: string, buffer: Buffer): Promise<void> {
        return util.promisify(fs.writeFile)(filepath, buffer);
    }

    async deleteFile(filepath: string): Promise<void> {
        return util.promisify(fs.unlink)(filepath);
    }

    async deleteFiles(...filepaths: string[]): Promise<void> {
        for (const filepath of filepaths) {
            await this.deleteFile(filepath);
        }
    }

    getBufferFromBase64(data: string): Buffer {
        return Buffer.from(this.parseBase64(data), 'base64');
    }

    private parseBase64(data: string): string {
        const base64Prefix = 'base64,';
        if (data.startsWith(base64Prefix)) {
            return data.substr(base64Prefix.length);
        } else {
            return data;
        }
    }
}

/* Tiré des tutoriels du cours et du travail d'équipe LOG2990-01, Automne 2018 */
