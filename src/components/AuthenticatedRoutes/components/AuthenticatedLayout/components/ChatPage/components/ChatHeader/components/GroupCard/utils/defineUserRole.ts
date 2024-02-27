import { GroupType } from "@redux-types";

type RoleType = "CREATOR" | "SUPER_ADMIN" | "ADMIN" | "MEMBER";

function defineUserRole(group: GroupType, id: string): RoleType {
  if (group.createdBy.id === id) {
    return "CREATOR";
  }

  if (group.groupSuperAdmins.includes(id)) {
    return "SUPER_ADMIN";
  }

  if (group.groupAdmins.includes(id)) {
    return "ADMIN";
  }

  return "MEMBER";
}

export default defineUserRole;
