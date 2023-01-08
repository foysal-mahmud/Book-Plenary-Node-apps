import React, { useEffect, useState } from "react";
import Layout from "../../Components/Layouts/Layout";
import { FaBook, FaStar, FaWpforms, FaBookReader } from "react-icons/fa";
import { GoPerson } from "react-icons/go";
import { MdCategory } from "react-icons/md";
import { CgDetailsMore } from "react-icons/cg";
import "./bookDetails.scss";
import Breadcumb from "../../Components/Breadcumb/Breadcumb";
import { useDispatch, useSelector } from "react-redux";
import { getAllBooks, getAllCategories, getAllReviews } from "../../Actions";
import { imgUrl } from "../../urlConfig";
import RateStar from "../../Components/RatingStar/RatingStar";
import axios from "../../Helpers/axios";
import { useHistory } from "react-router";
import Accordion from "../../Components/Accordion/Accordion";
import Footer from "../../Components/Footer/Footer";
import ReactHtmlParser from "react-html-parser";
import {FiDownload} from "react-icons/fi";
import { BsFillShareFill } from "react-icons/bs";
import { RiBookmark3Line } from "react-icons/ri";
import { AiOutlineCloseSquare } from "react-icons/ai"
import Modal from 'react-modal';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookShareButton,
  FacebookMessengerShareButton,
  PinterestIcon,
  PinterestShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton
} from "react-share";

const BookDetail = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.user);
  const book = useSelector((state) => state.book);
  const [cateList, setCateList] = useState([]);
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [review, setReview] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [ratingValid, setRatingValid] = useState();
  const [reviewValid, setReviewValid] = useState();
  const [failureMessage, setFailureMessage] = useState(false);
  const [sucessMessage, setSuccessMessage] = useState(false);
  const [render,setRender] = useState(false);
  const reviews = useSelector((state) => state.review.reviews);
  const book_id = props.match.params.id;
  const user_id = user?.user?.id;
  const b = book.books.find((x) => x.id == props.match.params.id);
  const token = localStorage.getItem("access_token");
  // const reviewComments = rv.filter((x) => x.book_id == props.match.params.id);

  const title = "This is a great book. I suggest you to read this at your convenient time."

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      border: '1px solid black',
      width: '400px'
    },
  };

  Modal.setAppElement('#root');
  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    try {
      setCateList(b.categories)
    } catch (error) {
      console.log(error.message);
    }
  }, []);
  useEffect(() => {
    dispatch(getAllCategories());
  }, []);
  useEffect(() => {
    dispatch(getAllBooks());
  }, []);
  useEffect(() => {
    dispatch(getAllReviews(props.match.params.id));
  }, [render]);
  const categoryHandle = (item) => {
    history.push(`/books/category/${item.id}`);
  };

  const downloadBook = (item) => {
    fetch(imgUrl+item).then(response => {
      response.blob().then(blob => {
          // Creating new object of PDF file
          const fileURL = window.URL.createObjectURL(blob);
          // Setting various property values
          let alink = document.createElement('a');
          alink.href = fileURL;
          alink.download = item;
          alink.click();
      })
  })
  }

  const reviewSumitHandle = async () => {
    const obj = {
      book_id,
      rating,
      review,
      user_id,
    };
    console.log(obj)
    if (rating == null) {
      setRatingValid(false);
      setReviewValid(true);
    } else if (review == "") {
      setRatingValid(true);
      setReviewValid(false);
    } else {
      setReviewValid(true);
      setRatingValid(true);
      try {
        const res = await axios.post("/submit/review", obj, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 200) {
          setRender(!render);
          setSuccessMessage(true);
        }
      } catch (error) {
        setFailureMessage(true);
      }
      setRating(null);
      setReview("");
    }
  };
  const alerClose = () => {
    setSuccessMessage(false);
    setFailureMessage(false);
  };
  const getRatingValue = () => {
    let r = 0;
    let count = reviews.length;
    reviews.forEach((item, index) => {
      r = r + item.rating;
    });
    return Math.round(r / count);
  };
  return (
    <Layout>
      <div className="bDetailsContainer">
        <Breadcumb
          route1="/"
          page1="Home"
          route2="/books"
          page2="Books"
          name={b?.name}
        />
        <div className="bdContent">
          <div className="bookImageDiv">
            <img
              src={imgUrl + b?.bookImage}
              alt="BookImage"
              width="180px"
              height="190px"
              style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.5)" }}
            />
          </div>
          <div className="bookInfo">
            <div style={{ display: "flex" }}>
              <FaBook size={20} color={"#19626a"} />
              <p>{b?.name}</p>
              <div style={{ paddingLeft: "20px" }}>
                <RateStar size="20" rating={getRatingValue()} />
              </div>
            </div>
            <div style={{ display: "flex", marginTop: "10px" }}>
              <GoPerson size={20} color={"#19626a"} />
              <p style={{ fontSize: "18px", color: "#19626a" }}>Author -</p>
              <p style={{ fontSize: "18px" }}>{b?.writer}</p>
            </div>
            <div style={{ display: "flex", marginTop: "10px" }}>
              <MdCategory size={20} color={"#19626a"} />
              <div>
                <div>
                  <p style={{ fontSize: "18px", color: "#19626a" }}>Category</p>
                </div>
                <div style={{ display: "flex" }}>
                  {cateList.map((item, index) => {
                    return (
                      <label
                        className="cateName"
                        key={index}
                        onClick={() => categoryHandle(item)}
                      >
                        {item?.type}
                      </label>
                    );
                  })}
                </div>
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "20px" }}
                >
                  <button
                    className="bookReadAndDownloadButton1"
                    onClick={() => downloadBook(b?.bookFile)}
                  >
                    <FiDownload size={20} />
                    <p>Download</p>
                  </button>
                  <button
                    className="bookReadAndDownloadButton2"
                    onClick={() => window.open(imgUrl + b?.bookFile)}
                  >
                    <FaBookReader size={20} />
                    <p>Read book</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <div className="bookmarkSection">
              <RiBookmark3Line size={20} color={"blue"} />
              <p className="bookmarked">Add to wish list</p>
            </div>
            <div className="bookmarkSection" onClick={openModal}>
              <BsFillShareFill size={20} color={"blue"} />
              <p className="bookmarked">Share this book</p>
            </div>
          </div>
        </div>
        <div>
          <Accordion
            status={true}
            icon={<CgDetailsMore size={20} />}
            headtitle={"Description"}
          >
            {ReactHtmlParser(b?.description)}
          </Accordion>
        </div>
        {/* All the reviews */}
        <div style={{ marginTop: "30px" }}>
          <Accordion
            icon={<FaStar size={20} />}
            headtitle={"All reviews"}
            status={true}
          >
            {reviews?.length > 0 ? (
              reviews.map((item, index) => {
                return (
                  <div style={{ display: "flex" }} key={index}>
                    <div>
                      <img
                        src={process.env.PUBLIC_URL + "/avater.png"}
                        alt="Avater"
                        height="50px"
                        width="50px"
                      />
                    </div>
                    <div>
                      <div style={{ display: "flex" }}>
                        <div style={{ padding: "10px" }}>
                          <h5>{item.users.name}</h5>
                        </div>
                        <div style={{ padding: "10px" }}>
                          <RateStar rating={item.rating} />
                        </div>
                      </div>
                      <div style={{ padding: "10px", fontSize: "12px" }}>
                        Date: {item.createdAt}
                      </div>
                      <div style={{ padding: "10px" }}>{item.review}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>There are no reviews yet.</div>
            )}
          </Accordion>
        </div>
        {/* Submit your review */}
        <div style={{ marginTop: "30px" }}>
          <Accordion
            status={true}
            icon={<FaWpforms size={20} />}
            headtitle={"Submit you review"}
          >
            {sucessMessage ? (
              <div className="alertMessage">
                <span className="closebtn" onClick={alerClose}>
                  &times;
                </span>
                <strong>Review submit success!</strong>
              </div>
            ) : null}
            {failureMessage ? (
              <div className="falertMessage">
                <span className="closebtn" onClick={alerClose}>
                  &times;
                </span>
                <strong>Review submit failed!</strong>
              </div>
            ) : null}
            <div style={{ display: "flex" }}>
              <div>
                <label>Your rating: </label>
              </div>
              <div>
                {[...Array(5)].map((star, index) => {
                  const ratingValue = index + 1;
                  return (
                    <label>
                      <input
                        type="radio"
                        value={ratingValue}
                        name="rating"
                        className="radioButton"
                        onClick={() => setRating(ratingValue)}
                      />
                      <FaStar
                        size={20}
                        className="star"
                        color={
                          ratingValue <= (hover || rating) ? "orange" : "grey"
                        }
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(null)}
                      />
                    </label>
                  );
                })}
              </div>
            </div>
            {ratingValid === false ? (
              <span style={{ color: "red" }}>Rating is required!</span>
            ) : (
              <span></span>
            )}
            <div>
              <label>Your review:</label>
              <br />
              <textarea
                placeholder="Enter your review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              ></textarea>
              {reviewValid === false ? (
                <span style={{ color: "red" }}>Review is required!</span>
              ) : (
                <span></span>
              )}
            </div>
            <div>
              <button className="rsButton" onClick={reviewSumitHandle}>
                Submit
              </button>
            </div>
          </Accordion>
        </div>
        {/* Modal for share */}
        <div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <div className="modalTitle">
              <h4>Share the book</h4>
              <button onClick={closeModal} className="modalCloseBtn">
                <AiOutlineCloseSquare size={20} />
              </button>
            </div>
            <div className="modalBody">
              <FacebookMessengerShareButton url={imgUrl + b?.bookFile} title={title}>
                <FacebookMessengerIcon size={32}/>
              </FacebookMessengerShareButton>
              <EmailShareButton url={imgUrl + b?.bookFile} title={title}>
                <EmailIcon size={32}/>
              </EmailShareButton>
              <TelegramShareButton url={imgUrl + b?.bookFile} title={title}>
                <TelegramIcon size={32} />
              </TelegramShareButton>
              <PinterestShareButton media={imgUrl + b?.bookFile} description={title}>
                <PinterestIcon size={32} />
              </PinterestShareButton>
              <FacebookShareButton url={imgUrl + b?.bookFile} title={title}>
                <FacebookIcon size={32} />
              </FacebookShareButton>
              <TwitterShareButton url={imgUrl + b?.bookFile} title={title}>
                <TwitterIcon size={32} />
              </TwitterShareButton>
            </div>
          </Modal>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default BookDetail;
