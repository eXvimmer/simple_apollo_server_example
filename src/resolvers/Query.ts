import { Post } from "@prisma/client";
import { IContext } from "..";

export const Query = {
  posts: async (
    _: unknown,
    __: unknown,
    { prisma }: IContext
  ): Promise<Post[]> => {
    const posts = await prisma.post.findMany({
      orderBy: [{ createdAt: "desc" }],
    });
    return posts;
  },
};
