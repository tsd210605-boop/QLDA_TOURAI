import React, { useState, useEffect } from "react";
import {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  getAllRoles,
  updateRolePermissions,
  getAllPermissions,
} from "../../../api/authApi";
import "./userManagement.css";

const ALL_ROLES = ["ADMIN", "OPERATOR", "SALES", "GUIDE", "CUSTOMER"];

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("users"); // "users" | "matrix"
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Search & filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");

  // Edit Role modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Matrix edit state: { [roleId]: Set of permission names }
  const [matrixState, setMatrixState] = useState({});
  const [savingMatrix, setSavingMatrix] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    setError("");
    try {
      const [usersData, rolesData, permsData] = await Promise.all([
        getAllUsers(),
        getAllRoles(),
        getAllPermissions(),
      ]);

      const userList = Array.isArray(usersData) ? usersData : usersData.value || [];
      setUsers(userList);
      setRoles(rolesData || []);
      setPermissions(permsData || []);

      // Build matrix state
      const initialMatrix = {};
      (rolesData || []).forEach((r) => {
        initialMatrix[r.roleId] = new Set(
          (r.permissions || []).map((p) => p.name)
        );
      });
      setMatrixState(initialMatrix);
    } catch (err) {
      setError(err.message || "Không thể tải dữ liệu phân quyền.");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role || "CUSTOMER");
  };

  const handleSaveUserRole = async () => {
    if (!selectedUser || !newRole) return;
    setActionLoading(true);
    setError("");
    try {
      await updateUserRole(selectedUser.userId, newRole);
      showNotification(`Đã phân vai trò ${newRole} cho tài khoản ${selectedUser.email}`);
      setSelectedUser(null);
      await fetchInitialData();
    } catch (err) {
      setError(err.message || "Lỗi khi cập nhật vai trò.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";
    const confirmText =
      nextStatus === "BLOCKED"
        ? `Bạn có chắc muốn tạm khóa tài khoản "${user.email}"?`
        : `Bạn có muốn mở khóa tài khoản "${user.email}"?`;

    if (!window.confirm(confirmText)) return;

    setError("");
    try {
      await updateUserStatus(user.userId, nextStatus);
      showNotification(
        `Đã ${nextStatus === "BLOCKED" ? "tạm khóa" : "kích hoạt"} tài khoản ${user.email}`
      );
      await fetchInitialData();
    } catch (err) {
      setError(err.message || "Lỗi khi đổi trạng thái tài khoản.");
    }
  };

  // Matrix permission checkbox toggle
  const handleTogglePermission = (roleId, permName) => {
    setMatrixState((prev) => {
      const currentSet = new Set(prev[roleId] || []);
      if (currentSet.has(permName)) {
        currentSet.delete(permName);
      } else {
        currentSet.add(permName);
      }
      return {
        ...prev,
        [roleId]: currentSet,
      };
    });
  };

  const handleSaveMatrix = async (roleId) => {
    setSavingMatrix(true);
    setError("");
    try {
      const permList = Array.from(matrixState[roleId] || []);
      await updateRolePermissions(roleId, permList);
      const roleObj = roles.find((r) => r.roleId === roleId);
      showNotification(
        `Đã lưu thiết lập quyền thành công cho vai trò: ${roleObj ? roleObj.name : roleId}`
      );
      await fetchInitialData();
    } catch (err) {
      setError(err.message || "Lỗi khi lưu phân quyền.");
    } finally {
      setSavingMatrix(false);
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.phone && u.phone.includes(searchTerm));
    const matchRole = filterRole === "ALL" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const getRoleBadge = (roleName) => {
    const r = (roleName || "").toUpperCase();
    switch (r) {
      case "ADMIN":
        return <span className="rbac-badge rbac-badge-admin">ADMIN</span>;
      case "OPERATOR":
        return <span className="rbac-badge rbac-badge-operator">OPERATOR</span>;
      case "SALES":
        return <span className="rbac-badge rbac-badge-sales">SALES</span>;
      case "GUIDE":
        return <span className="rbac-badge rbac-badge-guide">GUIDE</span>;
      default:
        return <span className="rbac-badge rbac-badge-customer">CUSTOMER</span>;
    }
  };

  return (
    <div className="user-mgmt-container">
      <div className="user-mgmt-header">
        <div>
          <h2>Quản lý Người Dùng & Phân Quyền (RBAC)</h2>
          <p className="subtitle">
            Hệ thống xác thực JWT & kiểm soát truy cập dựa trên vai trò theo đặc tả Báo cáo
          </p>
        </div>
        <div className="header-stats">
          <div className="stat-pill">
            <span className="stat-num">{users.length}</span>
            <span className="stat-label">Tổng Users</span>
          </div>
          <div className="stat-pill">
            <span className="stat-num">
              {users.filter((u) => u.role === "ADMIN").length}
            </span>
            <span className="stat-label">Admin</span>
          </div>
          <div className="stat-pill">
            <span className="stat-num">
              {users.filter((u) => u.role === "OPERATOR").length}
            </span>
            <span className="stat-label">Operator</span>
          </div>
          <div className="stat-pill">
            <span className="stat-num">
              {users.filter((u) => u.role === "SALES").length}
            </span>
            <span className="stat-label">Sales</span>
          </div>
        </div>
      </div>

      {error && <div className="rbac-alert rbac-alert-error">{error}</div>}
      {successMsg && <div className="rbac-alert rbac-alert-success">{successMsg}</div>}

      <div className="user-mgmt-tabs">
        <button
          className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <i className="fa fa-users"></i> Danh sách Tài khoản & Vai trò ({users.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "matrix" ? "active" : ""}`}
          onClick={() => setActiveTab("matrix")}
        >
          <i className="fa fa-shield-alt"></i> Ma trận Phân quyền Vai trò ({roles.length} Roles)
        </button>
      </div>

      {loading ? (
        <div className="rbac-loading">
          <i className="fa fa-spinner fa-spin"></i> Đang tải dữ liệu RBAC...
        </div>
      ) : activeTab === "users" ? (
        <div className="tab-pane">
          <div className="filter-bar">
            <div className="search-box">
              <i className="fa fa-search"></i>
              <input
                type="text"
                placeholder="Tìm theo tên, email, số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="role-filter">
              <label>Lọc vai trò:</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="ALL">Tất cả vai trò ({users.length})</option>
                {ALL_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r} ({users.filter((u) => u.role === r).length})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="rbac-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ và Tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Vai trò (Role)</th>
                  <th>Trạng thái</th>
                  <th>Quyền hạn được cấp</th>
                  <th style={{ textAlign: "center" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "30px" }}>
                      Không tìm thấy tài khoản phù hợp
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.userId}>
                      <td><strong>#{u.userId}</strong></td>
                      <td>
                        <div className="user-cell-name">
                          <strong>{u.name || "Chưa cập nhật"}</strong>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.phone || "—"}</td>
                      <td>{getRoleBadge(u.role)}</td>
                      <td>
                        <span
                          className={`status-pill ${
                            u.status === "BLOCKED" ? "status-blocked" : "status-active"
                          }`}
                        >
                          {u.status === "BLOCKED" ? "Đã khóa" : "Hoạt động"}
                        </span>
                      </td>
                      <td>
                        <div className="perms-tag-container">
                          {u.permissions && u.permissions.length > 0 ? (
                            u.permissions.slice(0, 3).map((p) => (
                              <span key={p} className="perm-chip">
                                {p}
                              </span>
                            ))
                          ) : (
                            <span className="perm-chip-empty">Chưa có quyền</span>
                          )}
                          {u.permissions && u.permissions.length > 3 && (
                            <span className="perm-chip-more">
                              +{u.permissions.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div className="action-buttons-inline">
                          <button
                            type="button"
                            className="btn-action btn-edit-role"
                            onClick={() => handleOpenRoleModal(u)}
                            title="Phân lại vai trò"
                          >
                            <i className="fa fa-user-tag"></i> Phân vai trò
                          </button>
                          <button
                            type="button"
                            className={`btn-action ${
                              u.status === "BLOCKED" ? "btn-unlock" : "btn-lock"
                            }`}
                            onClick={() => handleToggleStatus(u)}
                            title={
                              u.status === "BLOCKED"
                                ? "Mở khóa tài khoản"
                                : "Khóa tài khoản"
                            }
                          >
                            <i
                              className={`fa ${
                                u.status === "BLOCKED" ? "fa-unlock" : "fa-ban"
                              }`}
                            ></i>{" "}
                            {u.status === "BLOCKED" ? "Mở khóa" : "Khóa"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="tab-pane">
          <div className="matrix-description-banner">
            <h3><i className="fa fa-info-circle"></i> Bảng Phân Quyền Vai Trò (Role-Permission Matrix)</h3>
            <p>
              Cấu hình các quyền hạn (Permissions) chi tiết cho từng nhóm vai trò trong hệ thống TravelBook.
              Các thay đổi sẽ được phản ánh trực tiếp vào token JWT và luồng kiểm soát truy cập (RBAC).
            </p>
          </div>

          <div className="matrix-scroll-container">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th className="sticky-col">Module / Quyền hạn</th>
                  {roles.map((r) => (
                    <th key={r.roleId} className="role-col-header">
                      <div className="role-header-title">{getRoleBadge(r.name)}</div>
                      <div className="role-header-desc">{r.description}</div>
                      <button
                        type="button"
                        className="btn-save-role-perms"
                        onClick={() => handleSaveMatrix(r.roleId)}
                        disabled={savingMatrix}
                      >
                        <i className="fa fa-save"></i> Lưu quyền
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissions.map((perm) => (
                  <tr key={perm.permissionId}>
                    <td className="sticky-col perm-desc-cell">
                      <span className="module-tag">{perm.module}</span>
                      <strong>{perm.name}</strong>
                      <div className="perm-sub">{perm.description}</div>
                    </td>
                    {roles.map((r) => {
                      const isChecked = Boolean(
                        matrixState[r.roleId] &&
                          matrixState[r.roleId].has(perm.name)
                      );
                      const isAdminRole = r.name === "ADMIN";
                      return (
                        <td key={r.roleId} className="matrix-cell">
                          <label className="checkbox-wrap">
                            <input
                              type="checkbox"
                              checked={isAdminRole || isChecked}
                              disabled={isAdminRole}
                              onChange={() =>
                                handleTogglePermission(r.roleId, perm.name)
                              }
                            />
                            <span className="checkmark"></span>
                          </label>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Change Role */}
      {selectedUser && (
        <div className="rbac-modal-backdrop" onClick={() => setSelectedUser(null)}>
          <div className="rbac-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rbac-modal-header">
              <h3>Phân Vai Trò cho Người Dùng</h3>
              <button
                type="button"
                className="close-btn"
                onClick={() => setSelectedUser(null)}
              >
                &times;
              </button>
            </div>
            <div className="rbac-modal-body">
              <p>
                <strong>Tài khoản:</strong> {selectedUser.name} ({selectedUser.email})
              </p>
              <p>
                <strong>Vai trò hiện tại:</strong> {getRoleBadge(selectedUser.role)}
              </p>

              <div className="form-group-role">
                <label>Chọn vai trò mới:</label>
                <div className="role-radio-list">
                  {ALL_ROLES.map((r) => (
                    <label key={r} className="role-radio-item">
                      <input
                        type="radio"
                        name="selectedRole"
                        value={r}
                        checked={newRole === r}
                        onChange={(e) => setNewRole(e.target.value)}
                      />
                      <div className="role-radio-info">
                        <strong>{r}</strong>
                        <span>
                          {r === "ADMIN" && "Toàn quyền cấu hình, tài khoản và phân quyền"}
                          {r === "OPERATOR" && "Điều hành tour, phân bổ nhà cung cấp, lịch trình"}
                          {r === "SALES" && "Tư vấn tour, xử lý đơn đặt chỗ, hóa đơn VAT"}
                          {r === "GUIDE" && "Hướng dẫn viên du lịch, điểm danh hành khách"}
                          {r === "CUSTOMER" && "Khách hàng du lịch, tìm và đặt tour trực tuyến"}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="rbac-modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setSelectedUser(null)}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                className="btn-confirm"
                onClick={handleSaveUserRole}
                disabled={actionLoading}
              >
                {actionLoading ? "Đang lưu..." : "Xác nhận phân vai trò"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
