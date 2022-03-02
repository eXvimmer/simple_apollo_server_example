import { IContext } from "..";

interface PostParent {
  authorId: number;
  // NOTE: truncated
}

export const Post = {
  user: ({ authorId }: PostParent, _: unknown, { prisma }: IContext) => {
    return prisma.user.findUnique({
      where: {
        id: authorId,
      },
    });
  },
};
