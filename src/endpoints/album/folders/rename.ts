import {AlbumFile, AlbumFolder} from '../../../models';
import {IUser, IAlbumFile, IAlbumFolder} from '../../../interfaces';

export default function(user: IUser, folderId: string, name: string): Promise<Object> {
	'use strict';

	if (name.length > 100) {
		return <Promise<any>>Promise.reject('too-long-name');
	}

	return new Promise<Object>((resolve, reject) => {
		AlbumFolder.findOne({
			_id: folderId,
			user: user.id
		}, (folderFindErr: any, folder: IAlbumFolder) => {
			if (folderFindErr !== null) {
				reject(folderFindErr);
			} else if (folder === null) {
				reject('folder-not-found');
			} else {
				folder.name = name;
				folder.save((saveErr: any, renamed: IAlbumFolder) => {
					if (saveErr !== null) {
						return reject(saveErr);
					}
					resolve(renamed.toObject());
				});
			}
		});
	});
}
