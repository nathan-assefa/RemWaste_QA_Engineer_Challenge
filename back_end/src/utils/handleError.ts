import { Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const handlePrismaError = (
  error: unknown,
  res: Response,
  context: string = "processing your request"
) => {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P1001":
        return res.status(500).json({
          success: false,
          msg: "Database connection error. Please try again later.",
        });
      case "P2002":
        return res.status(400).json({
          success: false,
          msg: `Unique constraint failed while ${context}. Duplicate entry found.`,
        });
      case "P2025":
        return res.status(404).json({
          success: false,
          msg: `Record not found while ${context}.`,
        });
      default:
        return res.status(500).json({
          success: false,
          msg: `Database error occurred while ${context}.`,
        });
    }
  }

  return res.status(500).json({
    success: false,
    msg: `An unexpected error occurred while ${context}.`,
  });
};
