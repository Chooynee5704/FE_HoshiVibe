"use client"

import { User, Plus, MoreHorizontal } from "lucide-react"
import { Button, Spin } from "antd"
import { useEffect, useState } from "react"
import { getUserWithProfileById } from "../../../api/usersAPI"

type Props = {
  customerId: string
  onBack?: () => void
}

export default function CustomerDetailPage({ customerId, onBack }: Props) {
  // Mock customer data
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try{
        const data = await getUserWithProfileById(customerId);
        setCustomer(data);
      } catch (e: any) {
        setErr(e?.message || "Lỗi tải thông tin khách hàng");
      } finally {
        setLoading(false);
      }
    })();
  }, [customerId]);

    if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

    if (err) {
    return (
      <div className="text-center text-red-500 mt-10">{err}</div>
    );
  }

  if (!customer) {
    return null;
  }

  const profile = customer.profileDTO || {};
  const formatDate = (iso?: string) => {
    if (!iso || iso.startsWith("0001-01-01")) return "";
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

   return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 flex flex-col">
        <div className="px-6 py-6 max-w-6xl">
          <button onClick={onBack} className="mb-4 text-sm text-blue-600 hover:underline">
            ← Quay lại danh sách khách hàng
          </button>

          {/* Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-800">
                  {profile.fullName || customer.account || customer.email}{" "}
                  <span className="text-gray-600 font-normal">
                    (<a href={`mailto:${customer.email}`} className="text-blue-600 hover:underline">
                      {customer.email}
                    </a>)
                  </span>
                </h1>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{customer.role?.toUpperCase()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300">
                <Plus className="w-4 h-4 mr-1" />
                Thêm ghi chú
              </Button>
              <Button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-3">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Profile details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Chi tiết hồ sơ</h2>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Ngày sinh</p>
                <p className="text-sm text-gray-800">{formatDate(profile.yob) || "-"}</p>

                <p className="text-xs font-medium text-gray-600 mb-1 mt-3">Cung hoàng đạo</p>
                <p className="text-sm text-gray-800">{profile.zodiac || "-"}</p>

                <p className="text-xs font-medium text-gray-600 mb-1 mt-3">Nơi sinh</p>
                <p className="text-sm text-gray-800">{profile.yobDestination || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Email</p>
                <p className="text-sm text-gray-800">{customer.email}</p>

                <p className="text-xs font-medium text-gray-600 mb-1 mt-3">Tài khoản</p>
                <p className="text-sm text-gray-800">{customer.account}</p>

                <p className="text-xs font-medium text-gray-600 mb-1 mt-3">Trạng thái</p>
                <p className="text-sm text-gray-800">
                  {customer.isDisabled ? "Đã vô hiệu hóa" : "Đang hoạt động"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}