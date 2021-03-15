import { connect } from '../base.service';

export const getFrontPage = async (subreddit: string) => {
    try {
        const connection = connect();
        return await connection.getSubreddit(subreddit).getHot();
    } catch (err) {
        console.error(err);
        throw err;
    }
};
