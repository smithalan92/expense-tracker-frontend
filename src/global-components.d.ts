import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

declare global {
  export type Nullable<T> = T | null;
}

declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    "fa-icon": typeof FontAwesomeIcon;
  }
}
