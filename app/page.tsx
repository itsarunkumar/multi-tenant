import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import Button from "./btn";
import TenantCreator from "@/components/tenant-creator";

export default async function ServerComponent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return (
      <div>
        Not authenticated
        <Button />
      </div>
    );
  }
  return (
    <div>
      <h1>Welcome {session.user.name}</h1>
      <TenantCreator />
    </div>
  );
}
