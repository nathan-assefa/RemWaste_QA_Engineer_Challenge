import { Request, Response } from "express";
import { handlePrismaError } from "../utils/handleError";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

// Get all items for a user
export const getItems = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;

    const items = await prisma.item.findMany({ where: { userId } });
    res.json(items);
  } catch (error) {
    handlePrismaError(error, res, "getting items");
  }
};

// Create a new item
export const createItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "text is required" });
    }

    const newItem = await prisma.item.create({ data: { text, userId } });
    res.status(201).json(newItem);
  } catch (error) {
    return handlePrismaError(error, res, "creating an item");
  }
};

// Update an item by ID
export const updateItem = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "text field is required" });
    }

    const updated = await prisma.item.update({
      where: { id },
      data: { text },
    });

    res.json(updated);
  } catch (error) {
    return handlePrismaError(error, res, "updating item");
  }
};

// Delete an item by ID
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id as string;

    await prisma.item.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    return handlePrismaError(error, res, "deleting an item");
  }
};
