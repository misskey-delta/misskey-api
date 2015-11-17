import {AlbumFile} from '../models';
import {IUser, IAlbumFile} from '../interfaces';

export default (photoPost: any, me: IUser = null): Promise<Object> => {
	'use strict';
	return new Promise<Object>((resolve, reject) => {
		Promise.all(photoPost.photos.map((photo: string) => {
			return new Promise<Object>((fileResolve, fileReject) => {
				AlbumFile.findById(photo, (findErr: any, file: IAlbumFile) => {
					if (findErr !== null) {
						fileReject(findErr);
					} else {
						fileResolve(file.toObject());
					}
				});
			});
		})).then((photoFiles: Object[]) => {
			photoPost.photos = photoFiles;
			resolve(photoPost);
		}, (err: any) => {
			reject(err);
		});
	});
}
