import { Post } from "@prisma/client";
import { IContext } from "../../index";

interface PostArgs {
  post: {
    title?: string;
    content?: string;
  };
}

interface PostPayload {
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
    { prisma }: IContext
  ): Promise<PostPayload> => {
    // TODO: add authentication and authorization
    if (!title && !content) {
      return {
        userErrors: [
          { message: "To update a post, title and content must be provided" },
        ],
        post: null,
      };
    }

    const thePost = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
    });

    if (!thePost) {
      return {
        userErrors: [{ message: "Post does not exist" }],
        post: null,
      };
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
    { prisma }: IContext
  ): Promise<PostPayload> => {
    // TODO: add authentication & authorization
    const thePost = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
    });

    if (!thePost) {
      // NOTE: this might not be the best practice
      return {
        userErrors: [{ message: "Post does not exist" }],
        post: null,
      };
    }

    const post = await prisma.post.delete({ where: { id: +postId } });
    return {
      userErrors: [],
      post,
    };
  },
};
