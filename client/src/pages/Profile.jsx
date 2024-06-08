import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import useAuth from "../hooks/useAuth";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { MdOutlineEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({ username: "", email: "" });
  const [editUser, setEditUser] = useState({ username: "", email: "" });

  useEffect(() => {
    if (!auth.username) {
      navigate("/");
      return;
    }

    axios.defaults.withCredentials = true;
    axios
      .get(`http://localhost:3000/auth/getInfo/${auth.username}`)
      .then((res) => {
        setUser({ username: res.data.username, email: res.data.email });
      })
      .catch(() => {
        toast.warning("Something went wrong getting user information");
      });
  }, [auth.username, navigate]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
    setEditUser({ ...user });
  };

  const handleSave = () => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/auth/changeEmailUsername", {
        username: editUser.username,
        email: editUser.email,
      })
      .then(() => {
        axios
          .get("http://localhost:3000/auth/logout")
          .then(() => {
            setAuth({});
            toast.success(
              "Changes made successfully, You will be redirected to login page shortly."
            );

            setTimeout(() => {
              navigate("/login");
            }, 5000);
          })
          .catch(() => {
            toast.warning("Something went wrong updating user information");
          });
      })
      .catch(() => {
        toast.warning("Something went wrong updating user information");
      });

    setOpen(true);
  };

  return (
    <>
      <Card
        className="justify-content-center m-3 p-0 h-auto"
        style={{ width: 350 }}
      >
        <Card.Body>
          <Card.Title className="d-flex justify-content-between">
            Profile{" "}
            <Button
              onClick={handleOpen}
              className="pt-0"
              style={{ width: 40 }}
              variant="primary"
            >
              <MdOutlineEdit />
            </Button>
          </Card.Title>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>Username: {user.username} </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between">
              Email: {user.email}{" "}
            </ListGroup.Item>
            <Button
              onClick={() => {
                navigate(`/profile/${auth.username}/changePassword`);
              }}
              className="pt-0 mt-3"
              variant="primary"
            >
              Change password
            </Button>

            <Button
              onClick={() => {
                navigate(`/profile/${auth.username}/advertisements`);
              }}
              className="pt-0 mt-5"
              variant="primary"
            >
              See Your advertisements
            </Button>
          </ListGroup>
        </Card.Body>
      </Card>

      <Modal show={open} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup className="list-group-flush">
            <InputGroup className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-default" type="email">
                Email
              </InputGroup.Text>
              <Form.Control
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                defaultValue={user.email}
                onChange={(e) => {
                  setEditUser({ ...editUser, email: e.target.value });
                }}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-default">
                Username
              </InputGroup.Text>
              <Form.Control
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                defaultValue={user.username}
                onChange={(e) => {
                  setEditUser({ ...editUser, username: e.target.value });
                }}
              />
            </InputGroup>
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
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
