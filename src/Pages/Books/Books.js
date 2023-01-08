import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { getAllBooks, getAllCategories } from "../../Actions";
import Card from "../../Components/Card/card";
import Footer from "../../Components/Footer/Footer";
import Layout from "../../Components/Layouts/Layout";
import ReactPaginate from "react-paginate";
import CardSide from "../../Components/SideCard/CardSide";
import { imgUrl } from "../../urlConfig";
import "./Books.scss";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../Helpers/axios";

const Book = (props) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [searchItem, setSearcItem] = useState("");
  const category = useSelector((state) => state.category);
  const book = useSelector((state) => state.book);
  const [totalReviews, setTotalReviews ] = useState([]);

  const totalBooks = book.books;
  const [pageNumber, setpageNumber] = useState(0);
  const bookPerPage = 10;
  const pageVisited = pageNumber * bookPerPage;
  const pageCount = Math.ceil(totalBooks.length / bookPerPage);
  useEffect(() => {
    dispatch(getAllCategories());
  }, []);
  useEffect(() => {
    dispatch(getAllBooks());
  }, []);
  useEffect(() => {
    getReviews();
  }, []);
  const getReviews = () => {
    axiosInstance.get("/get/all/reviews")
    .then((response)=>{
      setTotalReviews(response.data.result);
    })
    .catch((error)=> {
      console.log(error)
    })
  }
  const categoryHandle = (item) => {
    history.push(`/books/category/${item.id}`);
  };
  const bookHandle = (item) => {
    history.push(`/book/details/${item.id}`);
  };
  const changePage = ({ selected }) => {
    setpageNumber(selected);
  };
  const getRatingValue = (reviews) => {
    let r = 0;
    let count = reviews.length;
    reviews.forEach((item, index) => {
      r = r + item.rating;
    });
    return Math.round(r / count);
  };
  return (
    <Layout>
      <div className="bookDiv">
        <div className="searchBox">
          <input
            type="text"
            placeholder="Search here by book name"
            value={searchItem}
            onChange={(e) => setSearcItem(e.target.value)}
          />
          <img
            src={process.env.PUBLIC_URL + "/search.png"}
            alt="Search"
            height="30px"
            width="30px"
          />
        </div>
        <div className="bookContent">
          <div className="bookContent1">
            <h4 className="Booktitle">List of books</h4>
            <div className="cardDiv">
              {totalBooks.slice(pageVisited, pageVisited + bookPerPage)
                .filter((val) => {
                  if (searchItem == "") {
                    return val;
                  } else if (
                    val.name.toLowerCase().includes(searchItem.toLowerCase())
                  ) {
                    return val;
                  }
                })
                .map((item, index) => {
                  const r = totalReviews.filter((x)=> x.book_id == item.id)
                  return (
                    <div className="cardRow" key={index}>
                      <Card
                        name={item?.name}
                        author={item?.writer}
                        image={imgUrl + item?.bookImage}
                        rating= {getRatingValue(r)}
                        onClick={() => bookHandle(item)}
                      />
                    </div>
                  );
                })}
            </div>
            <ReactPaginate
              previousLabel={"<"}
              nextLabel={">"}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName={"paginationBttn"}
              previousClassName={"previousBtn"}
              nextClassName={"nextBtn"}
              activeClassName={"activePagination"}
              disabledClassName={"disabledPagination"}
            />
          </div>
          <div className="bookContent2" style={{ marginLeft: "10px" }}>
            <div className="bookContent21">
              <h4 className="Booktitle">Categories</h4>
              <div className="categories">
                {category.categories.map((item, index) => {
                  return (
                    <p
                      key={index}
                      onClick={() => categoryHandle(item)}
                      className="categoryName"
                    >
                      {item?.type}
                    </p>
                  );
                })}
              </div>
            </div>
            <div className="bookContent21">
              <h4 className="Booktitle">Recent added books</h4>
              {book.books.slice(0, 2).reverse().map((item, index) => {
                const r = totalReviews.filter((x)=> x.book_id == item.id)
                return (
                  <div className="cardRow" key={index}>
                    <Card
                      name={item?.name}
                      author={item?.writer}
                      image={imgUrl + item?.bookImage}
                      rating={getRatingValue(r)}
                      onClick={() => bookHandle(item)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </Layout>
  );
};

export default Book;
