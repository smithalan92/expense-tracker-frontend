import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faCircleNotch, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function registerIconLibrary() {
  library.add(faXmark, faPlus, faCheck, faCircleNotch);
}
