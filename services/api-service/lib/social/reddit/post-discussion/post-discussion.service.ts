import { connect } from '../base.service';
import * as Mapper from '../shared-mapper';
import { Logger } from 'trader-sdk';

const log = new Logger.default({
    isPretty: true,
    name: 'Reddit Post Discussion'
});

export const getPostDiscussion = async (postId: string) => {
    try {
        const connection = connect();
        const submissionInst = connection.getSubmission(postId);
        //TODO update this with a more efficient model
        const comments = await submissionInst.comments.fetchAll({
            amount: 250 //TODO update these
        });
        if (!comments || comments.length <= 0) {
            throw Error('No posts found');
        }
        return comments.map(page => Mapper.mapComment(page));
    } catch (err) {
        log.error(err);
        throw err;
    }
};
