import { AppController } from './app.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { Connection, Model, connect } from 'mongoose';
import { Article, ArticleSchema } from './article/schema/article.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getModelToken } from '@nestjs/mongoose';
import { ArticleDTOStub } from 'test/stubs/article.dto.stub';
import { ArticleAlreadyExists } from 'src/exceptions/article-already-exists.exception';

describe('AppController', () => {
  let appController: AppController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let articleModel: Model<Article>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    articleModel = mongoConnection.model(Article.name, ArticleSchema);
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: getModelToken(Article.name), useValue: articleModel },
      ],
    }).compile();
    appController = app.get<AppController>(AppController);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe('postArticle', () => {
    it('should return the saved object', async () => {
      const createdArticle = await appController.postArticle(ArticleDTOStub());
      expect(createdArticle.title).toBe(ArticleDTOStub().title);
    });
    it('should return ArticleAlreadyExists (Bad Request - 400) exception', async () => {
      await new articleModel(ArticleDTOStub()).save();
      await expect(appController.postArticle(ArticleDTOStub())).rejects.toThrow(
        ArticleAlreadyExists,
      );
    });
  });

  describe('getArticle', () => {
    it('should return the corresponding saved object', async () => {
      await new articleModel(ArticleDTOStub()).save();
      const article = await appController.getArticle(ArticleDTOStub().title);
      expect(article.title).toBe(ArticleDTOStub().title);
    });
    it('should return null', async () => {
      const article = await appController.getArticle(ArticleDTOStub().title);
      expect(article).toBeNull();
    });
  });
});
