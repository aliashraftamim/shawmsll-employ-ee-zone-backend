/* eslint-disable no-console */
import mongoose from "mongoose";
import { adminService } from "../../../base/admin/admin.service";
import { ICategory } from "./category.interface";
import { Category } from "./category.model"; // Mongoose model ধরছি
import { categoryService } from "./category.service";

export async function defaultGuidanceCategory() {
  const admin = await adminService.getSupperAdmin();
  const adminId: mongoose.Types.ObjectId = admin._id;

  const existing = await Category.findOne();

  if (existing) {
    return;
  }

  const categories: ICategory[] = [
    {
      name: "Workplace Dynamics",
      admin: adminId,
      scenario: [
        "I feel I’m being micromanaged",
        "I feel I’m being treated differently than others",
        "My ideas are being ignored",
      ],
    },
    {
      name: "Unfair Treatment",
      admin: adminId,
      scenario: [
        "I was passed over for a promotion",
        "I feel I’m being treated differently than others",
        "I think I’m being retaliated against",
      ],
    },
    {
      name: "Inappropriate Behavior",
      admin: adminId,
      scenario: [
        "Someone made an offensive comment to me",
        "I’m uncomfortable with someone’s behavior",
        "My boundaries are being violated",
      ],
    },
    {
      name: "Burnout & Workload",
      admin: adminId,
      scenario: [
        "My workload is unmanageable",
        "I’m constantly working overtime",
        "I’m feeling exhausted and unmotivated",
      ],
    },
    {
      name: "Career Concerns",
      admin: adminId,
      scenario: [
        "I need clearer performance feedback",
        "I was told that I am underperforming",
        "I want to change roles",
      ],
    },
  ];

  await Promise.all(
    categories.map((category) =>
      categoryService.createCategory(adminId, category)
    )
  );

  console.info("✅ Default categories inserted.");
}
