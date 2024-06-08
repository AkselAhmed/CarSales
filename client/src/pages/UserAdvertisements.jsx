import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import AdvertisementItem from "../Components/AdvertisementItem";
import Col from "react-bootstrap/Col";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserAdvertisements() {
  const { username } = useParams();
  const [advertisements, setAdvertisements] = useState([]);
  const [changeHappening, setChangeHappening] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get(`http://localhost:3000/advertisement/userAdvertisements/${username}`)
      .then((res) => {
        if (res.data.status) {
          setAdvertisements(res.data.advertisements);
        }
      })
      .catch(() => {
        toast.warning("Something went wrong getting user advertisements.");
      });
  }, [username, changeHappening]);

  function handleEdit(e) {
    navigate(`/profile/${username}/advertisements/${e.target.value}`);
  }

  function handleDelete(e) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this advertisement?"
    );

    if (confirmDelete) {
      axios.defaults.withCredentials = true;
      axios
        .delete(
          `http://localhost:3000/advertisement/deleteAdvertisement/${e.target.value}`
        )
        .then((res) => {
          if (res.data.status) {
            toast.success("Advertisement deleted successfully.");
            setChangeHappening(!changeHappening);
          }
        })
        .catch(() => {
          toast.danger("There was an error deleting your advertisement.");
        });
    }
  }

  return (
    <Row>
      {advertisements.map((advertisement) => (
        <Row
          style={{ width: 500 }}
          className="m-1 border border-info border-2 justify-content-center align-items-center"
          key={advertisement._id}
        >
          <Col>
            <AdvertisementItem
              key={advertisement._id}
              advertisement={advertisement}
            />
          </Col>
          <Col>
            <Button
              variant="warning"
              className="my-5"
              style={{ width: 100, height: 50 }}
              value={advertisement._id}
              onClick={(e) => {
                handleEdit(e);
              }}
            >
              Edit
            </Button>
            <Button
              value={advertisement._id}
              variant="danger"
              style={{ width: 100, height: 50 }}
              onClick={(e) => handleDelete(e)}
            >
              Delete
            </Button>
          </Col>
        </Row>
      ))}
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
    </Row>
  );
}
