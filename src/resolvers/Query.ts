import { Post } from "@prisma/client";
import { IContext } from "..";

export const Query = {
  me: (_: unknown, __: unknown, { prisma, userInfo }: IContext) => {
    if (!userInfo) return null;
    return prisma.user.findUnique({
      where: {
        id: userInfo.userId,
      },
    });
  },

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

  profile: (
    _: unknown,
    { userId }: { userId: string },
    { prisma }: IContext
  ) => {
    return prisma.profile.findUnique({
      where: {
        userId: parseInt(userId),
      },
    });
  },
};
