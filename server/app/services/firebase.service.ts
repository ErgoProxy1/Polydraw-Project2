import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/storage';
import { injectable } from 'inversify';
import { FIREBASE_DATABASE_URL} from '../../app/server-constants/serverConstants';
import { FIREBASE_CONFIG } from '../../firebase';

(global as any).XMLHttpRequest = require('xhr2');  // Pas trouvé de moyen pour éviter ce require

import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as util from 'util';
import { Image } from '../utils/image';
import { Metadata } from '../utils/metadata';

@injectable()
export class FirebaseService {

    database: firebase.firestore.Firestore;
    store: firebase.storage.Storage;
    readonly _FIREBASE_CONFIG = FIREBASE_CONFIG;
    readonly PATH_TO_ACCOUNT = require('path');
    constructor() {
        const accountPath = this.PATH_TO_ACCOUNT.join(
            __dirname, '../../../../data/polydessin-6483b-firebase-adminsdk-vwz2n-a2b70d39cc.json'
        ); 
        const serviceAccount = require(accountPath);
        if (!firebase.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: FIREBASE_DATABASE_URL,
          });
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(this._FIREBASE_CONFIG);
        }

        this.database = firebase.firestore();
        this.store = firebase.storage();
    }

    async addImageMetadata(data: Metadata): Promise<void> {

        this.database.collection('Images/').add({
            tag: data.tag,
            url: data.url,
            createAt: data.createAt,
        }).then(() => {
            console.log('Adding data: SUCCESS !!');
        }).catch((error) => {
            console.error('Adding data: FAIL !!', error);
        });
    }

    async addImageBinary(image: Image, storageFileName: string): Promise<void> {

        this.readFile(image.path).then((buffer: Buffer) => {
            const dataType = {
                contentType: 'image/bmp',
            };

            // Uploader le fichier binaire
            const storageRef = this.store.ref('images');
            storageRef.child(storageFileName).put(buffer, dataType).then(() => {
                console.log('Sending image: SUCCESS !!');
            });
        });
    }

    async readFile(filepath: string): Promise<Buffer> {
        return util.promisify(fs.readFile)(filepath);
    }

    async getImageUrl(storageDirName: string, fileName: string): Promise<string> {

        const storageRef = this.store.ref(storageDirName + '/');
        return storageRef.child(fileName).getDownloadURL().then((url) => {
            console.log('URL = ' + url);
            return url;
        }).catch((error) => {
            console.log(error);
        });
    }

    async downloadImage(storageDirName: string, fileName: string): Promise<void> {
        const storageRef = this.store.ref(storageDirName + '/');
        storageRef.child(fileName).getDownloadURL().then((url) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
                // const blob = xhr.response;
            };

            xhr.open('GET', url);
            xhr.send();
        }).catch((error) => {
            console.log(error);
        });
    }

    async getImageById(id: string): Promise<Metadata> {

        const imagesRef = this.database.collection('Images/');
        // Créer une requête sur la collection.
        const query = imagesRef.where('id', '==', id);

        return query.get().then((querySnapshot: firebase.firestore.QuerySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, ' => ', doc.data());
            });
        }).then((image: any) => image as Metadata);
    }
}
