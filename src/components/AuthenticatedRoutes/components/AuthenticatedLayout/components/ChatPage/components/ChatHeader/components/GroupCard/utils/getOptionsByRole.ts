import { ItemType } from "antd/es/menu/hooks/useItems";
import { GroupType } from "@redux-types";
import defineUserRole from "./defineUserRole";

function getOptionsByRole(group: GroupType, id: string): ItemType[] {
    // switch(defineUserRole(group, id)) {
    //     case "CREATOR":
    //         return [];
    //     case "ADMIN":
    //         return [
    //             {

    //             }
    //         ]
    // }
    return []
}

export default getOptionsByRole;