import { deleteUser, getAdminUsers, updateUserRole } from "@/lib/actions/admin.actions";
import { auth } from "@/auth";
import { formatDisplayId } from "@/lib/format";

type AdminUser = Awaited<ReturnType<typeof getAdminUsers>>[number];

const AdminUsersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) => {
  const [users, session, params] = await Promise.all([getAdminUsers(), auth(), searchParams]);
  const q = params.q?.trim().toLowerCase() ?? "";
  const filteredUsers = q
    ? users.filter((user: AdminUser) =>
        [
          user.id,
          formatDisplayId("USR", user.id),
          user.name ?? "",
          user.email ?? "",
          user.role,
        ].some((value) => value.toLowerCase().includes(q))
      )
    : users;
  const disabledControlClass =
    "disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-500";

  async function onRoleUpdate(formData: FormData) {
    "use server";
    await updateUserRole(formData);
  }

  async function onDelete(formData: FormData) {
    "use server";
    await deleteUser(formData.get("userId")?.toString() || "");
  }

  return (
    <div>
      <h1 className="h2-bold mb-4">Users</h1>
      <div className="rounded border overflow-hidden">
        <div className="grid grid-cols-[110px_1fr_1fr_120px_190px] gap-3 bg-muted/40 p-3 text-xs font-semibold uppercase">
          <span>ID</span>
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Actions</span>
        </div>
        {filteredUsers.length ? filteredUsers.map((user: AdminUser) => (
          <div key={user.id} className="grid grid-cols-[110px_1fr_1fr_120px_190px] gap-3 border-t p-3 items-center text-sm">
            <span>{formatDisplayId("USR", user.id)}</span>
            <span>{user.name}</span>
            <span>{user.email}</span>
            <span>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs ${user.role === "admin" ? "bg-slate-900 text-white" : "bg-muted"}`}>
                {user.role}
              </span>
            </span>
            <div className="flex gap-2">
              <form action={onRoleUpdate} className="flex gap-2">
                <input type="hidden" name="userId" value={user.id} />
                <select
                  name="role"
                  defaultValue={user.role}
                  disabled={user.role === "admin"}
                  title={user.role === "admin" ? "Admin users cannot be modified here" : "Change user role"}
                  className={`rounded border px-2 py-1 text-xs ${disabledControlClass}`}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
                <button
                  disabled={user.role === "admin"}
                  title={user.role === "admin" ? "Admin users cannot be modified here" : "Save role"}
                  className={`rounded border px-2 py-1 text-xs ${disabledControlClass}`}
                >
                  Save
                </button>
              </form>
              <form action={onDelete}>
                <input type="hidden" name="userId" value={user.id} />
                {(() => {
                  if (user.role === "admin") {
                    return (
                      <button
                        disabled
                        title="Admin users cannot be deleted here"
                        className={`rounded border px-2 py-1 text-xs ${disabledControlClass}`}
                      >
                        Delete
                      </button>
                    );
                  }

                  const isCurrentUser = session?.user?.id === user.id;
                  const canDelete = !isCurrentUser;
                  return (
                <button
                  disabled={!canDelete}
                  title={
                    !canDelete
                      ? isCurrentUser
                        ? "You cannot delete your own account"
                        : "Delete user"
                      : "Delete user"
                  }
                  className={`rounded bg-red-600 px-2 py-1 text-xs text-white ${disabledControlClass}`}
                >
                  Delete
                </button>
                  );
                })()}
              </form>
            </div>
          </div>
        )) : <div className="border-t p-4 text-sm text-muted-foreground">No users match your search.</div>}
      </div>
    </div>
  );
};

export default AdminUsersPage;
