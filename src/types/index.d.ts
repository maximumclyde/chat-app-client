import FormFieldsPropsType from "./FormFieldsPropsType";
import { GlobalStoreType } from "../store/index";
import { InfoModalProps } from "../components/UIComponents/InfoModal/InfoModal";
import { StyledButtonProps } from "../components/UIComponents/StyledButton/StyledButton";
import { WarningModalProps } from "../components/UIComponents/WarningModal/WarningModal";

export type { GlobalStoreType };
export type { FormFieldsPropsType };
export type { InfoModalProps };
export type { StyledButtonProps };
export type { WarningModalProps };

export interface AxiosResponse<T> {
  data: T;
}

export * from "@redux-types";
