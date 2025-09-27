import React, { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import { HomeAPI } from "../../../pages/api/client/HomeAPI";
import { FileSearchOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { ProductCard } from "./productCard";
import { Breadcrumb, Pagination } from "antd";
export const TimKiem = ({ children }) => {
    const { ten } = useParams();
    //Load product
    const [products, setProducts] = useState([]);
    const [countProducts, setCountProducts] = useState([]);
    const getAll = () => {
        HomeAPI.timKiem(ten)
            .then((res) => {
                setProducts(res.data);
                setCountProducts(res.data.length);
            })
    }
    const getAllSanPham = () => {
        HomeAPI.getAllSanPham()
            .then((res) => {
                setProducts(res.data);
                setCountProducts(res.data.length);
            })
    }
    useEffect(() => {
        if (ten === "allsanpham") {
            getAllSanPham()
        } else {
            getAll();
        }
    }, [ten])
    //Phân trang
    const [currentPage, setCurrentPage] = useState(0);
    const productsPerPage = 12;
    const offset = currentPage * productsPerPage;
    const currentPageData = products.slice(offset, offset + productsPerPage);

    return (
        <>
            <Breadcrumb style={{ marginBottom: 10 }}>
                <Breadcrumb.Item>
                    <Link to="/home" className="no-underline">Trang chủ</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to={`/tim-kiem/${ten}`} className="no-underline"><b>Tìm kiếm</b></Link>
                </Breadcrumb.Item>
            </Breadcrumb>
            <div className="container">
                <div className="mt-4 mb-4"
                    style={{ display: "flex", alignItems: "center", height: 50, backgroundColor: "#DFF0D8", color: "#5B5B5B" }}>
                    <h5 className="ms-2"><FileSearchOutlined /> Có {countProducts} kết quả tìm kiếm phù hợp </h5>
                </div>
                <div className="container">
                    <div className="row">
                        {currentPageData.map((product, index) => {
                            return (
                                <div className="col-md-3 mt-4">
                                    <ProductCard key={index} product={product} />
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div class="container mt-3 mb-4">
                    <div className="d-flex justify-content-center">
                        <Pagination
                            current={currentPage + 1}
                            pageSize={productsPerPage}
                            total={products.length}
                            onChange={(page) => setCurrentPage(page - 1)}
                            showSizeChanger={false}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
