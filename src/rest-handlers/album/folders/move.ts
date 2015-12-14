import { IApplication, IUser } from '../../../interfaces';
import move from '../../../endpoints/album/folders/move';

export default function moveFolder(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';

	move(
		user,
		req.payload['folder-id'],
		req.payload['destination-folder-id']
	).then(folder => {
		res(folder);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
