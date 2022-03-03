import { userLoader } from "../loader/userLoader";

interface PostParent {
  authorId: number;
  // NOTE: truncated
}

export const Post = {
  user: ({ authorId }: PostParent) => {
    return userLoader.load(authorId);
  },
};
