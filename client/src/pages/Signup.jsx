import { useEffect, useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Signup.css";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Card } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";

export default function Signup() {
  const [validated, setValidated] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmationValid, setIsConfirmationValid] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmationPassword, setShowConfirmationPassword] =
    useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();

    if (form.checkValidity() === false || password !== confirmPassword) {
      e.preventDefault();
      e.stopPropagation();
      setIsConfirmationValid(false);
    } else {
      setIsConfirmationValid(true);
    }

    setValidated(true);

    if (!username || !email || !password || !confirmPassword) return;
    if (!isConfirmationValid) return;

    Axios.post("http://localhost:3000/auth/signup", {
      username,
      email,
      password,
    })
      .then((response) => {
        if (response.data.status) {
          toast.success("Registered successfully.");

          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      })
      .catch(() => {
        toast.warning("Username already exists, please try another.");
      });
  }

  useEffect(() => {
    if (password !== confirmPassword) {
      setIsConfirmationValid(false);
    } else {
      setIsConfirmationValid(true);
    }
  }, [confirmPassword, password]);

  const handleConfirmationPassword = (event) => {
    const { value } = event.target;
    setConfirmPassword(value);
    setIsConfirmationValid(password === value);
  };

  return (
    <>
      <Card className="mt-5 w-25 mx-auto justify-content-center align-items-center">
        <Card.Body className="w-75">
          <Card.Title>Registration Form</Card.Title>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            className="registrationForm"
          >
            <Row className="mb-3">
              <Form.Group as={Col} md="9" controlId="usernameValidation">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Username"
                  aria-describedby="inputGroupPrepend"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <div className="invalid-feedback">
                  Username field is required.
                </div>
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="9" controlId="emailValidation">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="E-mail"
                  aria-describedby="inputGroupPrepend"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="invalid-feedback">Email is invalid.</div>
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="9" controlId="passwordValidation">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    aria-describedby="inputGroupPrepend"
                    minLength={5}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    className="w-25"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>{" "}
                  <div className="invalid-feedback">
                    Password should be at least 5 characters.
                  </div>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group
                as={Col}
                md="9"
                controlId="passwordConfirmationValidation"
              >
                <Form.Label>Confirm password</Form.Label>
                <InputGroup>
                  <Form.Control
                    required
                    type={showConfirmationPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    onChange={handleConfirmationPassword}
                    pattern={password}
                  />
                  <Button
                    className="w-25"
                    onClick={() =>
                      setShowConfirmationPassword(!showConfirmationPassword)
                    }
                  >
                    {showConfirmationPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                  {isConfirmationValid ? (
                    <Form.Control.Feedback type="valid">
                      Looks good!
                    </Form.Control.Feedback>
                  ) : (
                    <Form.Control.Feedback type="invalid">
                      Confirmation password does not match initial password.
                    </Form.Control.Feedback>
                  )}
                </InputGroup>
              </Form.Group>
            </Row>

            <Button className="m-auto w-50 align-items-center" type="submit">
              Register
            </Button>

            <p>
              Already have an Account?<Link to="/login">Login</Link>
            </p>
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
