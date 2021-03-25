import { connect } from '../base.service';
import * as Mapper from '../shared-mapper';
import { Comment } from '../shared-types';

export const getPostDiscussion = async (postId: string): Promise<Comment[]> => {
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
        console.error(err);
        throw err;
    }
};
