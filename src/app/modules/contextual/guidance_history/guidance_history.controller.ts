/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { guidance_history_service } from "./guidance_history.service";

export class GuidanceHistoryController {
  // Create new guidance history
  static async create(req: Request, res: Response) {
    try {
      const payload = req.body;
      const result = await guidance_history_service.createGuiHist(payload);
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get all guidance histories
  static async getAll(req: Request, res: Response) {
    try {
      const result = await guidance_history_service.getAllGuiHist();
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get one by ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await guidance_history_service.getGuiHistById(id);
      if (!result) {
        return res.status(404).json({ success: false, message: "Not found" });
      }
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update by ID
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const result = await guidance_history_service.updateGuiHist(
        id,
        updateData
      );
      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "Not found or not updated" });
      }
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Soft delete by ID
  static async softDelete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await guidance_history_service.softDeleteGuiHist(id);
      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "Not found or not deleted" });
      }
      res
        .status(200)
        .json({ success: true, message: "Soft deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
