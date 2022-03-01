import { Post } from "@prisma/client";
import { IContext } from "../../index";
import { canUserMutateThePost } from "../../utils/canUserMutateThePost";

interface PostArgs {
  post: {
    title?: string;
    content?: string;
  };
}

export interface PostPayload {
  userErrors: {
    message: string;
  }[];
  post: Post | null;
}

export const postResolvers = {
  postCreate: async (
    _: unknown,
    { post: { title, content } }: PostArgs,
    { prisma, userInfo }: IContext
  ): Promise<PostPayload> => {
    if (!userInfo) {
      return {
        userErrors: [{ message: "forbidden (unauthenticated)" }],
        post: null,
      };
    }

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
        authorId: userInfo.userId,
      },
    });

    return {
      userErrors: [],
      post,
    };
  },

  postUpdate: async (
    _: unknown,
    {
      postId,
      post: { title, content },
    }: {
      postId: string;
      post: PostArgs["post"];
    },
    { prisma, userInfo }: IContext
  ): Promise<PostPayload> => {
    if (!userInfo) {
      return {
        userErrors: [{ message: "forbidden (unauthenticated)" }],
        post: null,
      };
    }

    if (!title && !content) {
      return {
        userErrors: [
          { message: "To update a post, title and content must be provided" },
        ],
        post: null,
      };
    }

    const postPayload = await canUserMutateThePost({
      userId: userInfo.userId,
      postId: +postId,
      prisma,
    });

    if (postPayload.userErrors.length) {
      return postPayload;
    }

    let payload = {
      title,
      content,
    };

    if (!title) delete payload.title;
    if (!content) delete payload.content;

    const post = await prisma.post.update({
      where: { id: parseInt(postId) },
      data: {
        ...payload,
      },
    });

    return {
      userErrors: [],
      post,
    };
  },

  postDelete: async (
    _: unknown,
    { postId }: { postId: string },
    { prisma, userInfo }: IContext
  ): Promise<PostPayload> => {
    if (!userInfo) {
      return {
        userErrors: [{ message: "forbidden (unauthenticated)" }],
        post: null,
      };
    }

    const postPayload = await canUserMutateThePost({
      userId: userInfo.userId,
      postId: +postId,
      prisma,
    });

    if (postPayload.userErrors.length) {
      return postPayload;
    }

    const post = await prisma.post.delete({ where: { id: +postId } });

    return {
      userErrors: [],
      post,
    };
  },
};
