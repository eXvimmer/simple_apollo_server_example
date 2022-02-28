import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IContext } from "../..";

interface SignupArgs {
  name: string;
  email: string;
  password: string;
  bio: string;
}

interface AuthPayload {
  userErrors: { message: string }[];
  token: string | null;
}

export const authResolvers = {
  signup: async (
    _: any,
    { email, password, bio, name }: SignupArgs,
    { prisma }: IContext
  ): Promise<AuthPayload> => {
    const isEmail = validator.isEmail(email);
    if (!isEmail) {
      return {
        userErrors: [{ message: "Invalid email" }],
        token: null,
      };
    }

    const isValidPassword = validator.isLength(password, {
      min: 8,
    });

    if (!isValidPassword) {
      return {
        userErrors: [
          { message: "Password must be at least 8 characters long" },
        ],
        token: null,
      };
    }

    if (!name) {
      return {
        userErrors: [{ message: "Invalid name" }],
        token: null,
      };
    }

    if (!bio) {
      return {
        userErrors: [{ message: "Invalid bio" }],
        token: null,
      };
    }

    const hashedPass = await bcrypt.hash(password, 11);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPass,
      },
    });

    await prisma.profile.create({
      data: {
        bio,
        userId: user.id,
      },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SIGNATURE!, {
      expiresIn: 360000,
    });

    return {
      userErrors: [],
      token,
    };
  },
};
