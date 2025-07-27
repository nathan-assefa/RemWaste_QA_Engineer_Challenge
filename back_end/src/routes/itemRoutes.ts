import { Router } from "express";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/itemController";
import { authenticateUser } from "../middleware/authMiddleware";

const itemRouter = Router();

// GET /items?userId=<uuid>
itemRouter.get("/api/items", authenticateUser, getItems);

// POST /items
itemRouter.post("/api/items", authenticateUser, createItem);

// PUT /items/:id
itemRouter.put("/api/items/:id", authenticateUser, updateItem);

// DELETE /items/:id
itemRouter.delete("/api/items/:id", authenticateUser, deleteItem);

export default itemRouter;
