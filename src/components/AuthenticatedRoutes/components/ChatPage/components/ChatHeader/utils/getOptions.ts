import { ItemType } from "antd/es/menu/hooks/useItems";

function getOptions(type: "FRIEND" | "GROUP" | undefined): ItemType[] {
  if (!type) {
    return [];
  }

  if (type === "FRIEND") {
    return [
      {
        label: "See profile",
        key: "SEE_PROFILE",
      },
      {
        label: "Remove friend",
        key: "REMOVE_FRIEND",
        danger: true,
      },
      {
        label: "Block friend",
        key: "BLOCK_FRIEND",
        danger: true,
      },
    ];
  } else {
    return [
      {
        label: "See members",
        key: "SEE_MEMBERS",
      },
      {
        label: "Leave group",
        key: "LEAVE_GROUP",
        danger: true,
      },
      {
        label: "Block Group",
        key: "BLOCK_GROUP",
        danger: true
      }
    ];
  }
}

export default getOptions;
