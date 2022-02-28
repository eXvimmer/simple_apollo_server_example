import "dotenv/config";
import { ApolloServer } from "apollo-server";
import { PrismaClient } from "@prisma/client";
import resolvers from "./resolvers";
import typeDefs from "./schema";

const prisma = new PrismaClient();

export interface IContext {
  prisma: typeof prisma;
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    prisma,
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
