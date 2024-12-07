import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowLeft,
  faCheck,
  faCircleNotch,
  faPenToSquare,
  faPlus,
  faRotateRight,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export default function registerIconLibrary() {
  library.add(
    faXmark,
    faPlus,
    faCheck,
    faCircleNotch,
    faArrowLeft,
    faRotateRight,
    faPenToSquare,
    faTrashCan,
  );
}
