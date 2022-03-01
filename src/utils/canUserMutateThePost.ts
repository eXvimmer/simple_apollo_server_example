import { IContext } from "..";
import { PostPayload } from "../resolvers/mutation/post";

interface IParams {
  userId: number;
  postId: number;
  prisma: IContext["prisma"];
}

export const canUserMutateThePost = async ({
  userId,
  postId,
  prisma,
}: IParams): Promise<PostPayload> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return {
      userErrors: [{ message: "forbidden (unauthorized)" }],
      post: null,
    };
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post) {
    return {
      userErrors: [{ message: "post does not exist" }],
      post: null,
    };
  }

  if (post.authorId !== user.id) {
    return {
      userErrors: [{ message: "forbidden (unauthorized)" }],
      post: null,
    };
  }

  return {
    userErrors: [],
    post: null,
    // NOTE: I set post: null, because in the resolver we don't need it
  };
};
