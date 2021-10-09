import _ from 'lodash';
import { Socials } from 'api-service';
import { CommentFilter, PostFilter } from '../filters';
import { CommentAnalyzer } from '../analyzers';
import { AnalyzerOptions, FlagsAndOptions } from '../../shared-types';
import { FrontPageGather } from '../gatherer-services';
import { config } from '../config';
import { FilterType } from '../filters';
import { OverrideTypes } from '../filters/models/override-types';
export interface FrontPageServiceArgs extends FlagsAndOptions {
  subreddit: string;
  analyzer: string;
}

export class FrontPageService {
  private subreddit: string;
  private filterType: FilterType;
  private analyizedCommentsList: CommentAnalyzer.CommentListAnalyzerResult[] = [];
  private analyzerOptions: AnalyzerOptions;
  private whitelist: string[] = [];
  private equityWhitelistEnabled: boolean;
  private overrideTypes: OverrideTypes;

  constructor(args: FrontPageServiceArgs) {
    _.assign(this, args);
    if (!config.supportedSubreddits.includes(this.subreddit)) {
      throw Error('Unsupported subreddit');
    }
    if (args.equityWhitelist && args.equityWhitelist.length > 0) {
      this.whitelist = args.equityWhitelist;
    }
    this.equityWhitelistEnabled = args.equityWhitelistEnabled || false;
  }

  async service(): Promise<void> {
    const frontPagePosts = await FrontPageGather.frontPageGather(this.subreddit);

    const filteredPosts = this.filterPosts(frontPagePosts);

    console.log(
      'Filtered Posts:',
      filteredPosts.map((post) => post.title)
    );

    for (const post of filteredPosts) {
      console.log('Gathering Discussion Thread from post: ', post.title);
      const discussionThread = await FrontPageGather.discussionGather(post.postId);
      //Continue to next post if no comments present
      if (discussionThread.length <= 0) {
        continue;
      }

      const filteredComments = this.filterComments(discussionThread);

      console.log(
        'Filtered Comments:',
        filteredComments.map((comment) => comment.body)
      );

      //If a post has no comments after filtering, continue to next post
      if (filteredComments.length <= 0) {
        continue;
      }

      this.analyizeCommentCollection(filteredComments, post.title);
    }
  }

  getSentimentAnalysisResults(): CommentAnalyzer.CommentListAnalyzerResult[] {
    return this.analyizedCommentsList;
  }

  private filterPosts(postList: Socials.Reddit.Types.Post[]) {
    const postFilterInst = new PostFilter({
      posts: postList,
      filterType: this.filterType,
      overrideTypes: this.overrideTypes
    });
    const filteredPosts = postFilterInst.filter();
    if (filteredPosts.length <= 0) {
      throw Error('No suitable posts found to process');
    }
    return filteredPosts;
  }

  private filterComments(comments: Socials.Reddit.Types.Comment[]) {
    const filteredCommentsInst = new CommentFilter({
      comments: comments,
      subreddit: this.subreddit,
      equityWhitelist: this.whitelist,
      equityWhitelistEnabled: this.equityWhitelistEnabled,
      filterType: this.filterType
    });

    return filteredCommentsInst.filter();
  }

  private analyizeCommentCollection(comments, title: string) {
    console.log('Starting Comment Analysis');
    const CommentAnalyzerInst = new CommentAnalyzer.CommentListSentimentAnalyzer({
      comments: comments,
      subreddit: this.subreddit,
      title: title,
      options: this.analyzerOptions
    });

    const commentAnalysisResults = CommentAnalyzerInst.analyze();
    if (
      commentAnalysisResults.positiveComments.length > 0 ||
      commentAnalysisResults.negativeComments.length > 0 ||
      commentAnalysisResults.neutralComments.length > 0
    ) {
      this.analyizedCommentsList.push(commentAnalysisResults);
    }
    console.log('Finished Comment Analysis');
  }
}
