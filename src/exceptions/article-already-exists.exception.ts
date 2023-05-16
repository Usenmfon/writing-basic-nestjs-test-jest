import { HttpException, HttpStatus } from '@nestjs/common';

export class ArticleAlreadyExists extends HttpException {
  constructor() {
    super('Article already exists!', HttpStatus.BAD_REQUEST);
  }
}
