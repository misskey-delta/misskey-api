import { User } from '../models';
import { IUser } from '../interfaces';

export default function extractMentions(text: string): Promise<IUser[]> {
	'use strict';
	const mentions = text.match(/@[a-zA-Z0-9\-]+/g);

	if (mentions === null) {
		return Promise.resolve(null);
	}

	return Promise.all(mentions.map(mention => new Promise<IUser>((resolve, reject) => {
		const sn = mention.replace('@', '');
		User.findOne({screenNameLower: sn.toLowerCase()}, (err: any, user: IUser) => {
			if (err !== null) {
				reject(err);
			} else {
				resolve(user);
			}
		});
	})));
}