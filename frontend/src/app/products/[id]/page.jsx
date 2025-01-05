"use client";
import { callAPI } from "../../../utils/api-caller";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../components/context";
import Link from "next/link";

const URL_SERVER = process.env.NEXT_PUBLIC_BACKEND_SERVER_MEDIA;

const ViewDetailProduct = () => {
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const { setShoppingCart } = useAppContext();
    const [showAlert, setShowAlert] = useState(false);
    const [quantity, setQuantity] = useState(1); // State to manage quantity
    const params = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        getDetailProduct();
    }, []);

    const getDetailProduct = async () => {
        try {
            const res = await callAPI("/products/" + params.id + "?populate=*", "GET");
            setProduct(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const addToCart = async (productId) => {
        try {
            const res = await callAPI("/add-to-shopping-cart", "POST", { productId, amount: quantity });
            console.log(res);
            setShoppingCart(res.data);
            setShowAlert(true);
            setTimeout(() => { setShowAlert(false); }, 2000);
        } catch (error) {
            console.log(error);
        }
    };

    const increaseQuantity = () => setQuantity(quantity + 1);
    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    return (
        product !== null ? (
            <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased pt-40" style={{fontFamily:"ALEGREYA-NORMAL"}}>
                <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
                        <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
                            <img className="w-full dark:hidden" src={URL_SERVER + product.attributes.image.data[0].attributes.url} alt={product.attributes.name} />
                            <img className="w-full hidden dark:block" src={URL_SERVER + product.attributes.image.data[0].attributes.url} alt={product.attributes.name} />
                        </div>

                        <div className="mt-6 sm:mt-8 lg:mt-0">
                            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                                {product.attributes.name}
                            </h1>
                            <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                                <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                                    đ{formatPrice(product.attributes.price)}
                                </p>
                            </div>

                            <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                                <div className="flex items-center">
                                    <button onClick={decreaseQuantity} className="px-2 py-1 border border-gray-300">-</button>
                                    <input type="text" value={quantity} readOnly className="w-12 text-center border-t border-b border-gray-300" />
                                    <button onClick={increaseQuantity} className="px-2 py-1 border border-gray-300">+</button>
                                </div>
                                
                            </div>

                            <div className=" mt-6 sm:gap-4  sm:items-center sm:flex sm:mt-8">
                                
                                <div onClick={(e) => { addToCart(product.id); e.stopPropagation(); }} className="ml-4">
                                    <button className="flex items-center justify-center py-2.5 px-5 text-sm bg-white text-[#EF2840] px-10 py-2 border-2 hover:bg-[#EF2840] hover:text-white focus:outline-none" style={{ fontSize: '12px', borderColor: '#EF2840', borderStyle: 'solid' }}>
                                        THÊM VÀO GIỎ
                                    </button>
                                </div>
                                <Link   href="/shopping-cart">
                                <div  className="ml-4">
                                    <button className="flex items-center justify-center py-2.5 px-5 text-sm bg-white text-[#EF2840] px-10 py-2 border-2 hover:bg-[#EF2840] hover:text-white focus:outline-none" style={{ fontSize: '12px', borderColor: '#EF2840', borderStyle: 'solid' }}>
                                        THANH TOÁN NGAY
                                    </button>
                                </div>
                                </Link>

                                
                            </div>


                            

                            <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

                            <div className="mb-6 text-gray-500 dark:text-gray-400">
                                {product.attributes.description}
                            </div>
                        </div>
                    </div>
                </div>
                {
                    showAlert &&
                    <div className="fixed bottom-[1%] right-[1%] flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                        <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span className="sr-only">Info</span>
                        <div>
                            <span className="font-medium">Success alert!</span>Thêm vào giỏ hàng thành công
                        </div>
                    </div>
                }
            </section>
        ) : (
            <div>Sản phẩm không tìm thấy</div>
        )
    );
};

export default ViewDetailProduct;
