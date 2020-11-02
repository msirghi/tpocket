import { loggingPlugin } from './config/loggerInterceptor.config';
import { CategoryResolver } from './resolvers/CategoryResolver';
import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/UserResolver';
import { createConnection } from 'typeorm';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { verify } from 'jsonwebtoken';
import { User } from './entity/User';
import TokenService from './services/TokenService';
import cors from 'cors';
import { ExpenseResolver } from './resolvers/ExpenseResolver';
import { PreferenceResolver } from './resolvers/PreferenceResolver';
import { StatisticsResolver } from './resolvers/StatisticsResolver';
import { AuthResolver } from './resolvers/AuthResolver';

(async () => {
  const app = express();
  await createConnection();

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true
    })
  );

  app.use(cookieParser());

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        CategoryResolver,
        ExpenseResolver,
        PreferenceResolver,
        StatisticsResolver,
        AuthResolver
      ]
    }),
    context: ({ req, res }) => ({ req, res }),
    plugins: [loggingPlugin]
  });
  apolloServer.applyMiddleware({ app, cors: false });

  app.post('/refresh_token', async (req, res) => {
    const token = req.cookies.jid;

    if (!token) {
      res.send({ ok: false, accessToken: '' });
    }

    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: '' });
    }
    const user = await User.findOne({ id: payload.userId });

    if (!user || user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: '' });
    }

    TokenService.sendRefreshToken(res, TokenService.createRefreshToken(user));
    return res.send({ ok: true, accessToken: TokenService.createAccessToken(user) });
  });

  app.listen(4000, () => {
    console.log(`Server started at ${process.env.SERVER_IP}${process.env.SERVER_PORT}.`);
    console.log(
      `GraphQL Playground ${process.env.SERVER_IP}:${process.env.SERVER_PORT}${process.env.GRAPHQL_ENDPOINT}.`
    );
  });
})();
