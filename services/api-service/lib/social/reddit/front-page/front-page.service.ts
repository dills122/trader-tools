import { connect } from '../base.service';
import * as Mapper from '../shared-mapper';

export const getFrontPage = async (subreddit: string) => {
    try {
        const connection = connect();
        const subredditInst = connection.getSubreddit(subreddit);
        const posts = await subredditInst.getHot({
            limit: 100 //TODO update these
        });
        if (!posts || posts.length <= 0) {
            throw Error('No posts found');
        }
        return posts.map(page => Mapper.mapPost(page));
    } catch (err) {
        console.error(err);
        throw err;
    }
};
