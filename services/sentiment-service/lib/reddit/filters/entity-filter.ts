export interface EntityFilterArgs {
  stringToAnalyze?: string;
}

export class EntityFilter {
  private stringToAnalyze: string;
  private cleanedString: string;
  constructor(args: EntityFilterArgs = {}) {
    if (args.stringToAnalyze) {
      this.setStringToAnalyze(args.stringToAnalyze);
    }
  }

  filter(stringToAnalyze?: string): string {
    if (!this.stringToAnalyze && !stringToAnalyze) {
      throw Error('No string to analyze');
    }
    if (stringToAnalyze) {
      this.setStringToAnalyze(stringToAnalyze);
    }
    const removedMarkdownLinksString = this.removeMarkdownLinks();
    const removedNewLineString = this.removeNewLinesIfPresent(removedMarkdownLinksString);
    const removedSubredditString = this.removeSubredditMentions(removedNewLineString);
    this.setCleanString(removedSubredditString);
    return this.getCleanString();
  }

  getCleanString(): string {
    return this.cleanedString;
  }

  private removeMarkdownLinks(stringToAnalyze: string = this.stringToAnalyze) {
    return stringToAnalyze.replace(/\[(.*?)\]\((.*?)\)/g, '');
  }

  private removeNewLinesIfPresent(stringToAnalyze: string = this.stringToAnalyze) {
    return stringToAnalyze.replace(/\r?\n|\r/g, '');
  }

  private removeSubredditMentions(stringToAnalyze: string = this.stringToAnalyze) {
    return stringToAnalyze.replace(/(r\/)+\w+/g, '');
  }

  private setStringToAnalyze(stringToAnalyze: string) {
    this.stringToAnalyze = stringToAnalyze;
  }

  private setCleanString(cleanString: string) {
    this.cleanedString = cleanString;
  }
}
