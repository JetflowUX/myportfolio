import { redirect } from "next/navigation";

export default function AdminRouteRedirect() {
  redirect("/login2admin");
}
