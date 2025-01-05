"use client";

import ProductComponent from "../../../components/product-component";
import { callAPI } from "../../../utils/api-caller";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Header from '../../../components/header';
import Footer from '../../../components/footer';
import "../../../styles/style.css";
const pageSize = 10;
const ProductByCategory = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const params = useParams();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [sortOption, setSortOption] = useState('');

    const [genres, setGenres] = useState([]); // State for genres
    const [selectedGenres, setSelectedGenres] = useState([]); // State for selected genres
    const [brands, setBrands] = useState([]); // State for brands
    const [selectedBrands, setSelectedBrands] = useState([]); // State for selected brands
    const [priceRange, setPriceRange] = useState([0, 2000000]); // State for price range

    const categoryImages = {
        1: '/images/banner/vinyl-banner.png', // example for category ID 1
        2: '/images/banner/cd-banner.png', // example for category ID 2
        3: '/images/banner/cassette-banner.png', // example for category ID 3
        // add more categories as needed
    };
    const [showGenres, setShowGenres] = useState(false);
    const [showBrands, setShowBrands] = useState(false);
    const [showPrices, setShowPrices] = useState(false);

    const toggleSection = (section) => {
        if (section === 'genres') setShowGenres(!showGenres);
        if (section === 'brands') setShowBrands(!showBrands);
        if (section === 'prices') setShowPrices(!showPrices);
    };


    useEffect(() => {
        fetchData();
        fetchGenres();
        fetchBrands();
    }, [selectedGenres, selectedBrands, priceRange, sortOption, currentPage]); // Add selectedGenres, selectedBrands, and priceRange as dependencies

    const fetchData = async () => {
        try {
            const categoryId = params.id;
            const genreFilter = selectedGenres.length > 0 ? `&filters[genre][$in]=${selectedGenres.join(',')}` : "";
            const brandFilter = selectedBrands.length > 0 ? `&filters[brand][$in]=${selectedBrands.join(',')}` : "";
            const priceFilter = `&filters[price][$gte]=${priceRange[0]}&filters[price][$lte]=${priceRange[1]}`;
            const pagination = `&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`;

            let sortQuery = '';
            if (sortOption === 'price-asc') {
                sortQuery = '&sort[price]=asc';
            } else if (sortOption === 'price-desc') {
                sortQuery = '&sort[price]=desc';
            }
            const queryURL = `/products?populate=*&filters[category][id][$eq]=${categoryId}${genreFilter}${brandFilter}${priceFilter}${sortQuery}${pagination}`;
            const res = await callAPI(queryURL, "GET");
            setProducts(res.data.data);
            setTotalPages(res.data.meta.pagination.pageCount);

            const res2 = await callAPI(`/categories/${categoryId}`, "GET");
            setCategory(res2.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchGenres = async () => {
        try {
            // Assuming your genres are stored in a separate API endpoint
            const res = await callAPI("/genres", "GET");
            setGenres(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchBrands = async () => {
        try {
            // Assuming your brands are stored in a separate API endpoint
            const res = await callAPI("/brands", "GET");
            setBrands(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleGenreChange = (event) => {
        const { value, checked } = event.target;
        setSelectedGenres(prevState =>
            checked ? [...prevState, value] : prevState.filter(genre => genre !== value)
        );
    };

    const handleBrandChange = (event) => {
        const { value, checked } = event.target;
        setSelectedBrands(prevState =>
            checked ? [...prevState, value] : prevState.filter(brand => brand !== value)
        );
    };

    const handlePriceChange = (value) => {
        setPriceRange(value);
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const changePage = (newPage) => {
        setCurrentPage(newPage);
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
        <div>
            <div className="container mx-auto px-0 pt-20" style={{ maxWidth: '1280px', fontFamily: "ALEGREYA-NORMAL" }}>
                <Header />
                <div className="flex justify-between flex-wrap">
                    {category && (
                        <img src={categoryImages[category.id]} alt="Category Banner" />
                    )}
                    {/* Left side - Filter Section */}
                    <div className="w-1/5 pt-4 pr-4 pl-1">
            <div>
                <label onClick={() => toggleSection('genres')} className="cursor-pointer font-bold">
                    Thể loại <span>{showGenres ? '▲' : '▼'}</span>
                </label>
                {showGenres && (
                    <div className="max-h-36 overflow-y-auto mt-1">
                        {genres.map((genre) => (
                            <div className="flex items-center inputItem" key={genre.id}>
                                <input
                                    type="checkbox"
                                    id={`genre-${genre.id}`}
                                    value={genre.attributes.name}
                                    onChange={handleGenreChange}
                                    className="mr-2"
                                />
                                <label htmlFor={`genre-${genre.id}`} className="text-sm">{genre.attributes.name}</label>
                            </div>
                        ))}
                    </div>
                )}
                <hr className="my-2 border-gray-300" />
            </div>
            <div>
                <label onClick={() => toggleSection('brands')} className="cursor-pointer font-bold">
                    Nghệ sĩ <span>{showBrands ? '▲' : '▼'}</span>
                </label>
                {showBrands && (
                    <div className="max-h-36 overflow-y-auto mt-1">
                        {brands.map((brand) => (
                            <div className="flex items-center inputItem" key={brand.id}>
                                <input
                                    type="checkbox"
                                    id={`brand-${brand.id}`}
                                    value={brand.attributes.name}
                                    onChange={handleBrandChange}
                                    className="mr-2"
                                />
                                <label htmlFor={`brand-${brand.id}`} className="text-sm">{brand.attributes.name}</label>
                            </div>
                        ))}
                    </div>
                )}
                <hr className="my-2 border-gray-300" />
            </div>
            <div>
                <label onClick={() => toggleSection('prices')} className="cursor-pointer font-bold">
                    Giá <span>{showPrices ? '▲' : '▼'}</span>
                </label>
                {showPrices && (
                    <div>
                        <Slider
                            range
                            min={0}
                            max={2000000}
                            step={100000}
                            value={priceRange}
                            onChange={handlePriceChange}
                            trackStyle={[{ backgroundColor: 'green' }]}
                            handleStyle={[{ borderColor: 'green' }, { borderColor: 'green' }]}
                            railStyle={{ backgroundColor: 'lightgrey' }}
                        />
                        <div>
                            Từ {formatPrice(priceRange[0])}₫ đến {formatPrice(priceRange[1])}₫
                        </div>
                    </div>
                )}
                <hr className="my-2 border-gray-300" />
            </div>
        </div>
                    {/* Right side - Products Section */}
                    <div className="w-3/4 pt-4 pr-1 pl-4" >
                        <div className="flex justify-between items-center mb-4 ">
                            <h2 className="text-lg ">Sắp xếp theo</h2>


                            <select className="border border-gray-300 rounded px-2 py-1 " onChange={handleSortChange} >
                                <option value="price-desc">Tất cả</option>
                                <option value="price-asc">Giá: Tăng dần</option>
                                <option value="price-desc">Giá: Giảm dần</option>
                            </select>
                        </div>

                        <div className="justify-between items-center grid grid-cols-5 gap-3 ">
                            {
                                products.map((value, index) => {
                                    return <ProductComponent
                                        id={value.id}
                                        key={index}
                                        productName={value.attributes.name}
                                        price={value.attributes.price}
                                        brand={value.attributes.brand}
                                        oldPrice={value.attributes.oldPrice} // Assuming oldPrice is directly under attributes
                                        isSale={value.attributes.isSale}
                                        imageUrl={value.attributes.image.data[0].attributes.url}
                                    />
                                })
                            }
                            {
                                products.length === 0 && <div>Loading...</div>
                            }

                        </div>

                        <div className="flex flex-col items-center">
                            <div className="pagination">
                                {currentPage > 1 && (
                                    <button onClick={() => changePage(currentPage - 1)}className="mr-2 rounded">Trước</button>
                                )}
                                <span>Trang {currentPage} / {totalPages}</span>
                                {currentPage < totalPages && (
                                    <button onClick={() => changePage(currentPage + 1)} className="ml-2 rounded">Sau</button>
                                )}
                            </div>

                        </div>

                    </div>


                </div>


            </div>
            <Footer />

        </div>
    );
};

export default ProductByCategory;