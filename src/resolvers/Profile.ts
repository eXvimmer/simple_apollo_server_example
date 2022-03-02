import { IContext } from "..";

interface ProfileParent {
  id: string;
  bio: string;
  userId: number;
}

export const Profile = {
  user: ({ userId }: ProfileParent, _: unknown, { prisma }: IContext) => {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  },
};
