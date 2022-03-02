import { IContext } from "..";

interface UserParent {
  id: number;
}

export const User = {
  posts: ({ id }: UserParent, _: any, { prisma, userInfo }: IContext) => {
    const isProfileOwner = id === userInfo?.userId;

    if (isProfileOwner) {
      return prisma.post.findMany({
        where: {
          authorId: id,
        },
        orderBy: [{ createdAt: "desc" }],
      });
    } else {
      // show all the public published posts
      return prisma.post.findMany({
        where: {
          authorId: id,
          published: true,
        },
        orderBy: [{ createdAt: "desc" }],
      });
    }
  },
};
