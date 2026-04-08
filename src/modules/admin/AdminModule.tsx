import { FormEvent, useEffect, useState } from "react";

import { ModuleShell } from "../../components/ModuleShell";
import { apiGet, apiPost } from "../../lib/api";

type UserRow = {
  user_id: string;
  email: string;
  full_name: string | null;
  role: string;
  status: string;
};

type PermissionRow = {
  role: string;
  permissions: string[];
};

export function AdminModule() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [matrix, setMatrix] = useState<PermissionRow[]>([]);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("manager");

  const load = () => {
    apiGet<UserRow[]>("/admin/users").then(setUsers).catch(() => setUsers([]));
    apiGet<PermissionRow[]>("/admin/permissions").then(setMatrix).catch(() => setMatrix([]));
  };

  useEffect(() => {
    load();
  }, []);

  const onUpdate = async (event: FormEvent) => {
    event.preventDefault();
    await apiPost("/admin/users/role", { user_id: userId, role });
    load();
  };

  return (
    <ModuleShell title="Admin" subtitle="RBAC, organization settings, API keys, and WhatsApp account mapping.">
      <form className="inline-form" onSubmit={onUpdate}>
        <label>User ID</label>
        <input value={userId} onChange={(e) => setUserId(e.target.value)} />
        <label>Role</label>
        <input value={role} onChange={(e) => setRole(e.target.value)} />
        <button type="submit">Update Role</button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td>{user.full_name || user.user_id}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="table">
        <thead>
          <tr>
            <th>Role</th>
            <th>Permissions</th>
          </tr>
        </thead>
        <tbody>
          {matrix.map((row) => (
            <tr key={row.role}>
              <td>{row.role}</td>
              <td>{row.permissions.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ModuleShell>
  );
}
