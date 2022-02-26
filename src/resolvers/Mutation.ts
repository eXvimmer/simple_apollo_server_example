import { Post } from ".prisma/client";
import { IContext } from "../index";

interface PostCreateArgs {
  title: string;
  content: string;
}

interface PostPayload {
  userErrors: {
    message: string;
  }[];
  post: Post | null;
}

export const Mutation = {
  postCreate: async (
    _: unknown,
    { title, content }: PostCreateArgs,
    { prisma }: IContext
  ): Promise<PostPayload> => {
    if (!title || !content) {
      return {
        userErrors: [
          {
            message: "To create a post, title and content must be provided",
          },
        ],
        post: null,
      };
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: 1, // TODO: authenticate and set to user id
      },
    });

    return {
      userErrors: [],
      post,
    };
  },
};
