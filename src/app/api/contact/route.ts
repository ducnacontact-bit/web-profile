import { NextResponse } from "next/server";

// Khai báo giá trị mặc định ban đầu để form không bị trống khi mới load
let contactConfig = {
  address: "123 Đường ABC, Hà Nội",
  email: "contact@domain.com",
  phone: "0987654321",
  mapUrl: "https://google.com/maps/...",
};

// 1. Phương thức GET: Lấy thông tin cấu hình hiện tại
export async function GET() {
  return NextResponse.json({
    success: true,
    data: contactConfig,
  });
}

// 2. Phương thức POST: Lưu lại cấu hình mới do Admin nhập
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address, email, phone, mapUrl } = body;

    // Cập nhật lại dữ liệu cấu hình
    contactConfig = {
      address: address !== undefined ? address : contactConfig.address,
      email: email !== undefined ? email : contactConfig.email,
      phone: phone !== undefined ? phone : contactConfig.phone,
      mapUrl: mapUrl !== undefined ? mapUrl : contactConfig.mapUrl,
    };

    console.log("=== ĐÃ CẬP NHẬT CẤU HÌNH CONTACT ===");
    console.log(contactConfig);

    return NextResponse.json(
      {
        success: true,
        message: "Lưu cấu hình contact thành công!",
        data: contactConfig,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Lỗi hệ thống khi lưu cấu hình." },
      { status: 500 },
    );
  }
}
