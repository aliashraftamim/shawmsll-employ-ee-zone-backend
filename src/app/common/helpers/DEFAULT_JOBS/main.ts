import { adminService } from "../../../modules/base/admin/admin.service";
import { defaultGuidanceCategory } from "../../../modules/contextual/_GUIDANCE/category/category.const";

export const defaultJob = async () => {
  // Create seed SUPPER ADMIN
  await adminService.seedSuperAdmin();

  //   Create default categories for guidance
  await defaultGuidanceCategory();
};
