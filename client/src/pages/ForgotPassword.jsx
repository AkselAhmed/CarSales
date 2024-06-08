import Axios from "axios";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import { Card } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [validated, setValidated] = useState(false);

  function handleSubmit(e) {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();

    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    setValidated(true);

    e.preventDefault();
    Axios.post("http://localhost:3000/auth/forgot-password", {
      email,
    })
      .then((response) => {
        if (response.data.status) {
          toast.success(
            "Email for reset password sent successfully! Please check your email and change your password with 5 MINUTES!"
          );
        }
      })
      .catch(() => {
        toast.error("No accound found with this email.");
      });
  }

  return (
    <>
      <Card className="mt-5 w-25 mx-auto justify-content-center align-items-center">
        <Card.Body className="w-75">
          <Card.Title>Reset Password Form</Card.Title>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            className="resetPasswordForm"
          >
            <Row className="mb-3">
              <Form.Group as={Col} md="9" controlId="emailValidation">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Email"
                  aria-describedby="inputGroupPrepend"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="invalid-feedback">Please enter your email.</div>
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Button className="m-auto w-50 align-items-center" type="submit">
              Send Email
            </Button>
          </Form>
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
