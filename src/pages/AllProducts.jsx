import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './allprods.css';

const AllProducts = () => {
    const [products, setProducts] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [sort, setSort] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const deleteProd = async (id) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/delproduct/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                const { message } = await res.json();
                getAllProducts();
                alert(message);
            } else {
                alert("Error occurred");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getAllProducts = async () => {
        try {
            const res = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/v1/getproducts?page=${currentPage}&pageSize=${pageSize}&sort=${sort}&search=${searchTerm}`
            );
            if (res.ok) {
                const { data, totalPages, currentPage: newCurrentPage } = await res.json();
                setProducts(data);
                setTotalPages(totalPages);
                setCurrentPage(newCurrentPage);
            } else {
                alert("Error Occurred");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllProducts();
    }, [currentPage, pageSize, sort, searchTerm]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    const handleSortChange = (event) => {
        setSort(event.target.value);
    };
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <section className='allprod'>
            <h2>All Products</h2>
            <div className="search-sort-container">
                <div className="sort-dropdown">
                    <label htmlFor="sort">Sort By:</label>
                    <select id="sort" onChange={handleSortChange} value={sort}>
                        <option value="">-- Select --</option>
                        <option value="price">Low to High</option>
                        <option value="price-desc">High to Low</option>
                    </select>
                </div>
                <div className="search-bar">
                    <label htmlFor="search">Search:</label>
                    <input
                        type="text"
                        id="search"
                        placeholder="Search products..."
                        onChange={handleSearchChange}
                        value={searchTerm}
                    />
                </div>
            </div>
            <div className="container">
                {products ? (
                    products.map((prod, i) => (
                        <div className="card" key={i} >
                            <div className="top">
                                <img src={prod.imgLink} alt="error loading" loading='lazy' />
                                <p>{prod.title}</p>
                            </div>
                            <div className="actions">
                                <button onClick={() => deleteProd(prod._id)} >delete</button>
                                <Link to={`/product/${prod._id}`} ><button>↗️</button></Link>
                                <Link to={`/update/${prod._id}`} ><button>Update</button></Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No Products</p>
                )}
            </div>
            <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} >Next</button>
            </div>
        </section>
    );
};

export default AllProducts;
