import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { SEOMetaData } from '../shared/meta-data.interface';

@Injectable()
export class SEOService {
  constructor(private meta: Meta) {}

  setAllTags(metaData: SEOMetaData): void {
    this.setTwitterTags(metaData);
  }

  setTwitterTags(metaData: SEOMetaData): void {
    // Twitter metadata
    this.meta.addTag({ name: 'twitter:card', content: 'summary' });
    // this.meta.addTag({ name: 'twitter:site', content: '@AngularUniv' });
    this.meta.addTag({
      name: 'twitter:title',
      content: metaData.description
    });
    this.meta.addTag({
      name: 'twitter:description',
      content: metaData.description
    });
    this.meta.addTag({
      name: 'twitter:text:description',
      content: metaData.description
    });
    // this.meta.addTag({
    //   name: 'twitter:image',
    //   content: 'https://avatars3.githubusercontent.com/u/16628445?v=3&s=200',
    // });
  }
}
