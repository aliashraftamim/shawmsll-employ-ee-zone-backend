/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { ICommunicationToolkit } from "./communication-toolkit.interface";
import { CommunicationToolkit } from "./communication-toolkit.model";

const createCommunicationToolkit = async (payload: ICommunicationToolkit) => {
  return await CommunicationToolkit.create(payload);
};

const getAllCommunicationToolkit = async (query: Record<string, any>) => {
  const filter: Record<string, any> = { isDeleted: false };

  if (query?.date) {
    const start = new Date(query.date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(query.date);
    end.setHours(23, 59, 59, 999);

    filter.createdAt = { $gte: start, $lte: end };
  }

  return await CommunicationToolkit.find(filter);
};

const getCommunicationToolkitById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await CommunicationToolkit.findOne({
    _id: id,
    isDeleted: { $ne: true },
  });
};

const updateCommunicationToolkit = async (
  id: string,
  updateData: Partial<ICommunicationToolkit>
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await CommunicationToolkit.findByIdAndUpdate(id, updateData, {
    new: true,
  });
};

const softDeleteCommunicationToolkit = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await CommunicationToolkit.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

export const communicationToolkitService = {
  createCommunicationToolkit,
  getAllCommunicationToolkit,
  getCommunicationToolkitById,
  updateCommunicationToolkit,
  softDeleteCommunicationToolkit,
};
