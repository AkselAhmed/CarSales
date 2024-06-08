import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Card } from "react-bootstrap";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  function handleChangePassword() {
    if (newPassword !== confirmPassword)
      toast.error("New password and confirm password do not match.");

    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/auth/changePassword", {
        password: currPassword,
        username: auth.username,
        newPassword,
      })
      .then((res) => {
        if (res.status)
          toast.success(
            "Password changed successfully, you will be redirected to login shortly."
          );
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
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <Card className="mt-5 w-25 mx-auto justify-content-center align-items-center">
        <Card.Body>
          <Card.Title>Change Password</Card.Title>
          <Row className="mb-3">
            <Form.Group as={Col} md="10" controlId="emailValidation">
              <Form.Label>Current password</Form.Label>
              <Form.Control
                required
                placeholder="Current password"
                type="password"
                aria-describedby="inputGroupPrepend"
                onChange={(e) => {
                  setCurrPassword(e.target.value);
                }}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group md="9" controlId="passwordValidation">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="New password"
                aria-describedby="inputGroupPrepend"
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group md="9" controlId="confirmPasswordValidation">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Confirm New password"
                aria-describedby="inputGroupPrepend"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </Form.Group>
          </Row>

          <Button
            onClick={handleChangePassword}
            className="m-auto align-items-center"
            type="submit"
          >
            Change password
          </Button>
        </Card.Body>
      </Card>
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
