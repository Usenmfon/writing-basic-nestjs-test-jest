import { ArticleDTO } from 'src/article/dto/article.dto';

export const ArticleDTOStub = (): ArticleDTO => {
  return {
    title: 'This is the title of the article',
    authorName: 'Vinicius Santos de Pontes',
    body: 'This is a stub for testing',
  };
};
