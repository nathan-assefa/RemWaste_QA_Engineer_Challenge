import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: { email, password, name },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: "User already exists" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({
        message: "JWT_SECRET is not defined in environment variables",
      });
    }

    const token = jwt.sign({ id: user.id }, secret, { expiresIn: "1h" });

    // ✅ Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only secure in prod
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.json({ message: "Login successful", userId: user.id });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
