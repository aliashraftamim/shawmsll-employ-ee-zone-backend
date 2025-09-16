import { adminService } from "../../../modules/base/admin/admin.service";
import { defaultGuidanceCategory } from "../../../modules/contextual/_GUIDANCE/category/category.const";
import { topUsedTools_service } from "./../../../modules/contextual/top-used-tools/top-used-tools.service";

export const defaultJob = async () => {
  // Create seed SUPPER ADMIN
  await adminService.seedSuperAdmin();
  await topUsedTools_service.seedTopUsedTools();
  //   Create default categories for guidance
  await defaultGuidanceCategory();
};
