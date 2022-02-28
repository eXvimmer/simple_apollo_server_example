import { authResolvers } from "./mutation/auth";
import { postResolvers } from "./mutation/post";

export const Mutation = {
  ...postResolvers,
  ...authResolvers,
};
