import { connect } from '../base.service';
import * as Mapper from '../shared-mapper';
import { Comment } from '../shared-types';

export const getPostDiscussion = async (postId: string): Promise<Comment[]> => {
  try {
    const connection = connect();
    const submissionInst = connection.getSubmission(postId);
    const comments = await submissionInst.comments.fetchMore({
      amount: 250,
      append: true
    });
    if (!comments || comments.length <= 0) {
      throw Error('No posts found');
    }
    return comments.map((page) => Mapper.mapComment(page));
  } catch (err) {
    console.error(err);
    throw err;
  }
};
