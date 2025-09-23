/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../../core/builders/QueryBuilder";
import { ITopUsedTools } from "./top-used-tools.interface";
import { TopUsedTools } from "./top-used-tools.model";

const defaultTools: ITopUsedTools[] = [
  {
    title: "workplace-journal",
    image: "https://i.ibb.co.com/HTxWHX27/span-1.png",
    matchField: "workplace-journal",
    priority: 1,
  },
  {
    title: "communication-toolkit",
    image: "https://i.ibb.co.com/4RG1s8NW/span.png",
    matchField: "communication-toolkit",
    priority: 1,
  },
  {
    title: "guidance",
    image: "https://i.ibb.co.com/TMS6srJ3/guidances.png",
    matchField: "guidance",
    priority: 1,
  },
  {
    title: "job-search-help",
    image: "https://i.ibb.co.com/TD0CRm38/job-seeker.png",
    matchField: "job-search-help",
    priority: 1,
  },
  {
    title: "policy-rights",
    image: "https://i.ibb.co.com/B55px4nk/insurance-policy.png",
    matchField: "policy-rights",
    priority: 1,
  },
];

const seedTopUsedTools = async () => {
  try {
    const count = await TopUsedTools.countDocuments();
    if (count === 0) {
      await TopUsedTools.insertMany(defaultTools);
      console.info("✅ TopUsedTools seeded successfully");
    } else {
      console.info("⚡ TopUsedTools already exist, skipping seeding");
    }
  } catch (err) {
    console.error("❌ Error seeding TopUsedTools:", err);
  }
};

const createTopUsedTools = async (payload: ITopUsedTools) => {
  return await TopUsedTools.create(payload);
};

const getAllTopUsedTools = async (query: Record<string, any>) => {
  const topUsedToolsQuery = new QueryBuilder(
    TopUsedTools.find({
      isDeleted: { $ne: true },
    }).sort({ priority: -1 }),
    query
  )
    .search([])
    .paginate()
    .fields();

  const meta = await topUsedToolsQuery.countTotal();
  const data = await topUsedToolsQuery.modelQuery;

  return { meta, data };
};

const getTopUsedToolsById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await TopUsedTools.findOne({ _id: id, isDeleted: { $ne: true } });
};

const updateTopUsedTools = async (
  id: string,
  updateData: Partial<ITopUsedTools>
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await TopUsedTools.findByIdAndUpdate(id, updateData, { new: true });
};

const softDeleteTopUsedTools = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await TopUsedTools.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

export const topUsedTools_service = {
  seedTopUsedTools,
  createTopUsedTools,
  getAllTopUsedTools,
  getTopUsedToolsById,
  updateTopUsedTools,
  softDeleteTopUsedTools,
};
