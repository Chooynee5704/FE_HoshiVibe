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
    <div className="px-6 pb-6">
      <div className="flex items-center justify-end gap-2 mb-4">
        <Button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300">
          <Plus className="w-4 h-4" />
          Mới
        </Button>
        <Button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300">
          <Filter className="w-4 h-4" />
          Lọc
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 w-12">
                  <Checkbox
                    checked={allChecked}
                    indeterminate={!allChecked && selectedIds.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tên</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">YOB (Ngày sinh)</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Zodiac (Cung)</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">YOB Destination (Nơi sinh)</th>
                {/* <th className="px-4 py-3 w-12"></th> */}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={7}>
                    Đang tải…
                  </td>
                </tr>
              ) : err ? (
                <tr>
                  <td className="px-4 py-6 text-center text-red-600" colSpan={7}>
                    {err}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={7}>
                    Chưa có dữ liệu
                  </td>
                </tr>
              ) : (
                rows.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={selectedIds.includes(c.id)}
                        onChange={() => toggleOne(c.id)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                          <img
                            src={c.avatar || "/placeholder.svg"}
                            alt={c.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          className="text-sm font-medium text-blue-600 hover:underline"
                          onClick={() => onOpenDetail?.(c.id)}
                          title="Xem chi tiết khách hàng"
                        >
                          {c.name}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-800">{c.email}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-800">{c.yob || "-"}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-800">{c.zodiac || "-"}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-800">{c.yobDestination || "-"}</span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => onOpenDetail?.(c.id)}
                        title="Xem chi tiết"
                      >
                        <MoreHorizontal className="w-5 h-5 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang tĩnh – an toàn khi build; bỏ nếu không cần */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2">
            <button className="w-10 h-10 bg-blue-600 text-white rounded-lg font-medium">1</button>
            <button className="w-10 h-10 hover:bg-gray-100 text-gray-600 rounded-lg font-medium">2</button>
            <button className="w-10 h-10 hover:bg-gray-100 text-gray-600 rounded-lg font-medium">3</button>
          </div>
        </div>
      </div>
    </div>
  );
}
