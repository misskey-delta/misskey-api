import { Match } from 'powerful';
import { IApplication, IUser } from '../../interfaces';
import like from '../../endpoints/posts/like';

export default function likePost(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';
	like(user, req.payload['post-id']).then(() => {
		res({ kyoppie: "yuppie" });
	}, (err: any) => {
		const statusCode = new Match<string, number>(err)
			.is('post-not-found', () => 404)
			.is('post-deleted', () => 410)
			.is('already-liked', () => 400)
			.getValue(500);

		res({error: err}).code(statusCode);
	});
};
