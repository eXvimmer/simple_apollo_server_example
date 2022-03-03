import { User } from "@prisma/client";
import DataLoader from "dataloader";
import { prisma } from "..";

type BatchUser = (ids: number[]) => Promise<User[]>;

const batchUsers: BatchUser = async ids => {
  const users = await prisma.user.findMany({ where: { id: { in: ids } } });

  // NOTE: ids and users should have the same order. so we map ids = [1, 3, 2]
  // to users = [{id: 1}, {id: 3}, {id: 2}]
  // a) My Solution
  return users.length ? ids.map(id => users.find(u => u.id === id)!) : [];

  // b) Instructor's solution
  // const userMap: { [key: string]: User } = {};
  // users.forEach(u => (userMap[u.id] = u));
  // return ids.map(id => userMap[id]);
};

// TODO: find a better solution
// @ts-ignore
export const userLoader = new DataLoader<number, User>(batchUsers);
