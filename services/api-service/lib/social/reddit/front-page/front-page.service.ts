import { connect } from '../base.service';
import * as Mapper from '../shared-mapper';

export const getFrontPage = async (subreddit: string) => {
    try {
        const connection = connect();
        const frontPagePosts = await connection.getSubreddit(subreddit).getHot();
        if (!frontPagePosts || frontPagePosts.length) {
            throw Error('No posts found');
        }
        return frontPagePosts.map(page => Mapper.mapPost(page));
    } catch (err) {
        console.error(err);
        throw err;
    }
};
