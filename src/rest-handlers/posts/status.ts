import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import create from '../../endpoints/posts/status';

export default function status(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	const text: string = req.payload['text'];
	if (text === undefined) {
		res('text is required').code(400);
		return;
	}
	create(
		app,
		user,
		text,
		req.payload['in-reply-to-post-id']
	).then((status: Object) => {
		res(status);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}