import { IGuidance } from "./guidance.interface";
import { Guidance } from "./guidance.model";

const createGuidance = async (payload: IGuidance) => {
  const result = await Guidance.create(payload);
  return result;
};

export const guidance_service = {
  createGuidance,
};
