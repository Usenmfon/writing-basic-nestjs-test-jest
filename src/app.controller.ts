import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ArticleDTO } from './article/dto/article.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('articles')
  postArticle(@Body() article: ArticleDTO) {
    return this.appService.postArticle(article);
  }

  @Get('article/:title')
  getArticle(@Param('title') title: string) {
    return this.appService.getArticle(title);
  }
}
