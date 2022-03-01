import "dotenv/config";
import { ApolloServer } from "apollo-server";
import { PrismaClient } from "@prisma/client";
import resolvers from "./resolvers";
import typeDefs from "./schema";
import { getUserFromToken } from "./utils/getUserFromToken";

const prisma = new PrismaClient();

export interface IContext {
  prisma: typeof prisma;
  userInfo: { userId: number } | null;
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }): IContext => {
    const token = req.headers.authorization ?? "";
    const userInfo = getUserFromToken(token);

    return {
      prisma,
      userInfo,
    };
  },
});

server
  .listen()
  .then(({ url }) => {
    console.log(`🚀 server is runing on: ${url}`);
  })
  .catch(() => {
    console.log("error");
  });
