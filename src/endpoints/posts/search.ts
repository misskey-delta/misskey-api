import { Match } from 'powerful';
import {Post} from '../../models';
import {IUser, IPost} from '../../interfaces';
import serializePosts from '../../core/serialize-posts';
import populateAll from '../../core/post-populate-all';

/**
 * 投稿を検索します
 * @param user API利用ユーザー
 * @param q クエリ
 * @param limit 取得する投稿の最大数
 * @param sinceCursor 取得する投稿を、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @param maxCursor 取得する投稿を、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 * @return 投稿オブジェクトの配列
 */
export default function(
	user: IUser,
	q: string,
	limit: number = 20,
	sinceCursor: number = null,
	maxCursor: number = null
): Promise<Object> {
	'use strict';

	if (limit < 1) {
		return <Promise<any>>Promise.reject('1 kara');
	} else if (limit > 100) {
		return <Promise<any>>Promise.reject('100 made');
	}

	const query = Object.assign({
		text: new RegExp(q, 'i')
	}, new Match<void, any>(null)
		.when(() => sinceCursor !== null, () => {
			return { cursor: { $gt: sinceCursor } };
		})
		.when(() => maxCursor !== null, () => {
			return { cursor: { $lt: maxCursor } };
		})
		.getValue({})
	);

	return new Promise<Object>((resolve, reject) => {
		Post.find(query)
		.sort('-createdAt')
		.limit(limit)
		.exec((searchErr: any, posts: IPost[]) => {
			if (searchErr !== null) {
				return reject(searchErr);
			} else if (posts === null) {
				return resolve([]);
			}

			Promise.all(posts.map(post => populateAll(post)))
			.then(populatedPosts => {
				// 整形
				serializePosts(populatedPosts, user).then(serializedPosts => {
					resolve(serializedPosts);
				}, (serializeErr: any) => {
					reject(serializeErr);
				});
			}, (populatedErr: any) => {
				reject(populatedErr);
			});
		});
	});
}
