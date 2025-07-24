import mongoose from "mongoose";
import { ICommunicationToolkit } from "./communication-toolkit.interface";
import { CommunicationToolkit } from "./communication-toolkit.model";

const createCommunicationToolkit = async (payload: ICommunicationToolkit) => {
  return await CommunicationToolkit.create(payload);
};

const getAllCommunicationToolkit = async () => {
  return await CommunicationToolkit.find({ isDeleted: { $ne: true } });
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
