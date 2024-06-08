import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { FaPhoneAlt } from "react-icons/fa";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { CiLocationOn } from "react-icons/ci";
import { BsCalendar2Date } from "react-icons/bs";
import { IoTimeOutline } from "react-icons/io5";
import useAuth from "../hooks/useAuth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";

import FormatDate from "../helpers/FormatDate";
import { addToFavourites } from "../features/favouritesSlice";

export default function AdvertisementInfo() {
  const [open, setOpen] = useState(false);
  const [reportDescription, setReportDescription] = useState("");
  const dispatch = useDispatch();

  const { id } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const initialState = {
    _id: "",
    image: "",
    brand: "",
    model: "",
    engine: "",
    productionYear: 0,
    phone: "",
    mileage: 0,
    price: 0,
    city: "",
    owner: "",
    description: "",
    postDate: "",
  };
  const [advertisement, setAdvertisement] = useState(initialState);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get(`http://localhost:3000/advertisement/getAdvertisement/${id}`)
      .then((res) => {
        //Might cause error ?
        if (res.data.status) {
          setAdvertisement(res.data.advertisement);
        }
      })
      .catch(() => {
        toast.warning("Something went wrong getting advertisement.");
      });
  }, [id]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleReport(advertisement) {
    if (!reportDescription) return;

    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/advertisement/reportAdvertisement", {
        id: advertisement._id,
        description: reportDescription,
      })
      .then((res) => {
        if (res.data.status) {
          toast.success("Advertisement reported successfully.");
          setOpen(false);
        }
      })
      .catch(() => {
        toast.danger("Something went wrong reporting advertisement.");
      });
  }

  function handleDelete() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this advertisement?"
    );

    if (confirmDelete) {
      axios.defaults.withCredentials = true;
      axios
        .delete(
          `http://localhost:3000/advertisement/deleteAdvertisement/${advertisement._id}`
        )
        .then((res) => {
          if (res.data.status) {
            toast.success("Advertisement deleted successfully.");

            setTimeout(() => {
              navigate("/");
            }, 3000);
          }
        })
        .catch(() => {
          toast.danger("There was an error deleting advertisement.");
        });
    }
  }

  function addToFavouritesHandler(advertisement) {
    let exists = dispatch(addToFavourites(advertisement));

    if (exists.payload) {
      toast.success("Added to favourites");
    } else toast.warning("This car is already in favourites");
  }

  return (
    <>
      {advertisement.postDate ? (
        <Row>
          <Card className="w-50 mt-3 p-0 h-100">
            <Card.Img variant="top" src={advertisement.image} />
          </Card>
          <Col lg="3">
            <Card
              className="justify-content-center m-3 p-0 h-100"
              style={{ width: 350 }}
            >
              <Card.Body>
                <Card.Title>
                  {advertisement.brand} {advertisement.model}
                </Card.Title>
                <ListGroup className="list-group-flush">
                  <ListGroup.Item>
                    Added on: <IoTimeOutline />
                    {" " + FormatDate(advertisement.postDate)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Engine: {advertisement.engine}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Production year: <BsCalendar2Date />{" "}
                    {advertisement.productionYear}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Additional information: {advertisement.description}
                  </ListGroup.Item>
                </ListGroup>

                <Button
                  variant="dark"
                  style={{
                    backgroundColor: "#060606",
                    ":hover": {
                      backgroundColor: "#060606",
                    },
                  }}
                >
                  {advertisement.price}$
                </Button>
                <div className="py-3 d-flex align-items-center">
                  <Button
                    onClick={() => {
                      addToFavouritesHandler(advertisement);
                    }}
                    className="mt-3 mx-2 w-50"
                  >
                    &#10084; Add to favourites
                  </Button>
                  <Button
                    onClick={handleOpen}
                    variant="warning"
                    className="mt-3 mx-2 w-50"
                  >
                    &#9888; Report advertisement
                  </Button>
                </div>
                {auth.role === "71a*Zl936" ? (
                  <Button
                    onClick={handleDelete}
                    variant="danger"
                    className="mt-3 mx-2 w-50"
                  >
                    Delete Advertisement
                  </Button>
                ) : (
                  ""
                )}
              </Card.Body>
            </Card>
          </Col>

          <Card
            className="justify-content-center m-3 p-0 h-100"
            style={{ width: 200 }}
          >
            <Card.Body>
              <Card.Title>Seller Information</Card.Title>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>
                  <CiLocationOn />
                  {advertisement.city}
                </ListGroup.Item>
                <ListGroup.Item>{advertisement.owner}</ListGroup.Item>
                <ListGroup.Item>
                  <FaPhoneAlt /> {advertisement.phone}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Row>
      ) : (
        <Spinner size="lg" animation="border" />
      )}
      <Modal show={open} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Report information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup className="list-group-flush">
            <InputGroup className="mb-3 d-flex" style={{ height: 200 }}>
              <Form.Control
                as="textarea"
                rows={5}
                className="h-100"
                style={{ textAlign: "left", resize: "vertical" }}
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                placeholder="Tell us what is wrong with the advertisement"
                onChange={(e) => {
                  setReportDescription(e.target.value);
                }}
              />
            </InputGroup>
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleReport(advertisement)}>
            Send Report
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
