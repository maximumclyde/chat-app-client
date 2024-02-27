import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { GlobalStoreType, AppDispatch } from "@types";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<GlobalStoreType> = useSelector;