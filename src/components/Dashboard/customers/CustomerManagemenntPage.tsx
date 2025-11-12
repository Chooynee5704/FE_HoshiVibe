"use client"

import { useEffect, useMemo, useState } from "react";
import { Plus, Filter, MoreHorizontal } from "lucide-react";
import { Button, Checkbox } from "antd";
import { getAllUsersWithProfiles } from "../../../api/usersAPI";

type Row = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  yob?: string;            // dd/MM/yyyy
  zodiac?: string;
  yobDestination?: string;
};

export default function CustomerManagementPage({
  onOpenDetail,
}: {
  onOpenDetail?: (customerId: string) => void;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const formatDate = (iso?: string) => {
    if (!iso || iso.startsWith("0001-01-01")) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await getAllUsersWithProfiles();
        const mapped: Row[] = data.map((u) => ({
          id: u.user_Id,
          name: (u.profileDTO?.fullName || u.account || u.email || "").trim(),
          email: u.email,
          avatar: u.profileDTO?.avatarUrl || "/placeholder.svg",
          yob: formatDate(u.profileDTO?.yob),
          zodiac: u.profileDTO?.zodiac || "",
          yobDestination: u.profileDTO?.yobDestination || "",
        }));
        setRows(mapped);
      } catch (e: any) {
        setErr(e?.message || "Lỗi tải danh sách khách hàng");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const allChecked = useMemo(
    () => rows.length > 0 && selectedIds.length === rows.length,
    [rows, selectedIds]
  );

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedIds(allChecked ? [] : rows.map((r) => r.id));
  };

  return (
    <div className="flex min-h-screen bg-white">
      <main className="flex-1 flex flex-col">
        {/* Page Title */}
        <div className="px-8 py-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-black">Quản lý khách hàng</h1>
          <p className="text-sm text-gray-600 mt-1">Quản lý thông tin khách hàng</p>
        </div>

        {/* Actions */}
        <div className="px-8 py-4 border-b border-gray-200">
          <div className="flex items-center justify-end gap-3">
            <Button className="bg-white hover:bg-gray-50 text-black border border-gray-300 font-medium">
              <Plus className="w-4 h-4" />
              Thêm mới
            </Button>
            <Button className="bg-white hover:bg-gray-50 text-black border border-gray-300 font-medium">
              <Filter className="w-4 h-4" />
              Lọc
            </Button>
          </div>
        </div>

        <div className="px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 w-12">
                      <Checkbox
                        checked={allChecked}
                        indeterminate={!allChecked && selectedIds.length > 0}
                        onChange={toggleAll}
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Tên</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Ngày sinh</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Cung hoàng đạo</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Nơi sinh</th>
                    <th className="px-6 py-4 w-12"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td className="px-6 py-12 text-center text-gray-500" colSpan={7}>
                        Đang tải…
                      </td>
                    </tr>
                  ) : err ? (
                    <tr>
                      <td className="px-6 py-12 text-center text-red-600" colSpan={7}>
                        {err}
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td className="px-6 py-12 text-center text-gray-500" colSpan={7}>
                        Chưa có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    rows.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <Checkbox
                            checked={selectedIds.includes(c.id)}
                            onChange={() => toggleOne(c.id)}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full border border-gray-300 overflow-hidden flex-shrink-0">
                              <img
                                src={c.avatar || "/placeholder.svg"}
                                alt={c.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              className="text-sm font-semibold text-blue-600 hover:underline"
                              onClick={() => onOpenDetail?.(c.id)}
                              title="Xem chi tiết khách hàng"
                            >
                              {c.name}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-800">{c.email}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-800">{c.yob || "-"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-800">{c.zodiac || "-"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-800">{c.yobDestination || "-"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            className="p-2 hover:bg-gray-100 rounded border border-gray-300"
                            onClick={() => onOpenDetail?.(c.id)}
                            title="Xem chi tiết"
                          >
                            <MoreHorizontal className="w-5 h-5 text-black" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-8 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-center gap-2">
                <button className="w-10 h-10 bg-blue-600 text-white rounded-lg font-medium">1</button>
                <button className="w-10 h-10 hover:bg-gray-100 text-gray-700 rounded-lg font-medium">2</button>
                <button className="w-10 h-10 hover:bg-gray-100 text-gray-700 rounded-lg font-medium">3</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
