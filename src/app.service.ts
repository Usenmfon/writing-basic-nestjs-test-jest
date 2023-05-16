import { Injectable } from '@nestjs/common';
import { Article } from './article/schema/article.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ArticleDTO } from './article/dto/article.dto';
import { Model } from 'mongoose';
import { ArticleAlreadyExists } from 'src/exceptions/article-already-exists.exception';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Article.name) private readonly articleModel: Model<Article>,
  ) {}

  async postArticle(article: ArticleDTO) {
    const existingArticle = await this.articleModel
      .findOne({ title: article.title })
      .exec();
    if (existingArticle) throw new ArticleAlreadyExists();
    const createdArticle = await new this.articleModel(article).save();
    return createdArticle as ArticleDTO;
  }

  async getArticle(title: string) {
    const article = await this.articleModel.findOne({ title: title }).exec();
    return article as ArticleDTO;
  }
}
