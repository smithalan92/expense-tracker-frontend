import { useAppSelector } from "@/store";
import { selectUser } from "@/store/slices/app";

export default function ExpenseList() {
  const user = useAppSelector(selectUser)!;

  if (!user) return null;

  return <h1>Hello {user.firstName}</h1>;
}
