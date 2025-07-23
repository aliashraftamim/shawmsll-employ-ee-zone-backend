import { ObjectId } from "mongoose";
import { IPat } from "./pat.interface";
import { PrivacyAboutTerms } from "./pat.model";

// ----- Create/Update Functions -----
const createPrivacy = async (currentUser: ObjectId, payload: Partial<IPat>) => {
  payload.modifiedBy = currentUser;
  payload.type = "privacy-policy";

  return await PrivacyAboutTerms.findOneAndUpdate(
    { type: "privacy-policy" },
    payload,
    { new: true, upsert: true }
  );
};

const createAbout = async (currentUser: ObjectId, payload: Partial<IPat>) => {
  payload.modifiedBy = currentUser;
  payload.type = "about-us";

  return await PrivacyAboutTerms.findOneAndUpdate(
    { type: "about-us" },
    payload,
    { new: true, upsert: true }
  );
};

const createTerms = async (currentUser: ObjectId, payload: Partial<IPat>) => {
  payload.modifiedBy = currentUser;
  payload.type = "terms-condition";

  return await PrivacyAboutTerms.findOneAndUpdate(
    { type: "terms-condition" },
    payload,
    { new: true, upsert: true }
  );
};

// ----- Auto-create if missing -----
const getPrivacy = async () => {
  return await PrivacyAboutTerms.findOneAndUpdate(
    { type: "privacy-policy" },
    {
      $setOnInsert: {
        body: "Privacy Policy content coming soon...",
      },
    },
    { new: true, upsert: true }
  );
};

const getAbout = async () => {
  return await PrivacyAboutTerms.findOneAndUpdate(
    { type: "about-us" },
    {
      $setOnInsert: {
        body: "About Us content coming soon...",
      },
    },
    { new: true, upsert: true }
  );
};

const getTerms = async () => {
  return await PrivacyAboutTerms.findOneAndUpdate(
    { type: "terms-condition" },
    {
      $setOnInsert: {
        body: "Terms and Conditions content coming soon...",
      },
    },
    { new: true, upsert: true }
  );
};

export const patService = {
  createPrivacy,
  createAbout,
  createTerms,
  getPrivacy,
  getAbout,
  getTerms,
};
