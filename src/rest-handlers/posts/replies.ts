import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import replies from '../../endpoints/posts/replies';

export default function replyPosts(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	replies(
		user,
		req.query['post-id'],
		req.query['limit'],
		req.query['since-cursor'],
		req.query['max-cursor']
	).then(post => {
		res(post);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
