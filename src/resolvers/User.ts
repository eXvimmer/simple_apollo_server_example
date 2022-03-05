import { IContext } from "..";

interface UserParent {
  id: number;
}

export const User = {
  posts: ({ id }: UserParent,
    { take, skip }: { take: number, skip: number },
    { prisma, userInfo }: IContext) => {
    const isProfileOwner = id === userInfo?.userId;

    if (isProfileOwner) {
      return prisma.post.findMany({
        where: {
          authorId: id,
        },
        orderBy: [{ createdAt: "desc" }],
        skip,
        take
      });
    } else {
      // show all the public published posts
      return prisma.post.findMany({
        where: {
          authorId: id,
          published: true,
        },
        orderBy: [{ createdAt: "desc" }],
        skip,
        take
      });
    }
  },
};
