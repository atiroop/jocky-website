import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import NewPostForm from "./post-form";

export default async function NewPostPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return <NewPostForm />;
}
