"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUser, isLogined } from "../../utils/helper";
import { useEffect } from "react";

const OrderConfirmationPage = () => {
    const router = useRouter();
    useEffect(() => {
        if (!isLogined()) {
            router.replace("/");
        }
    }, [router]);

    return (
        <div className="pt-40 flex flex-col items-center" style={{fontFamily:"ALEGREYA-NORMAL"}}>
            <h1 className="text-2xl font-bold mb-4 text-center">CẢM ƠN BẠN ĐÃ MUA HÀNG TẠI CODAE</h1>
            <p className="text-center text-gray-700 mb-8">
                Đơn hàng của bạn đã được xác nhận và đang được xử lý. Cảm ơn bạn đã tin tưởng và lựa chọn sản phẩm của chúng tôi.
            </p>
            <div>
                <Link href="/" className="text-white bg-[#EF2840] hover:bg-[#912c38] px-6 py-2 rounded-lg">
                    Quay lại trang chủ
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
