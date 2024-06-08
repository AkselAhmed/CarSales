import { useEffect, useState } from "react";
import Axios from "axios";
import "../styles/Signup.css";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { Card } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const navigateRoot = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = Cookies.get("token");
    const username = Cookies.get("username");
    const role = Cookies.get("role");

    if (token && username && role) {
      setAuth({ token, username, role });
    }

    if (auth.username && auth.token && auth.role) {
      navigateRoot("/");
    }
  }, [auth, location.pathname, navigateRoot, setAuth]);

  function handleSubmit(e) {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();

    setValidated(true);

    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    setValidated(false);

    if (!email || !password) return;

    Axios.defaults.withCredentials = true;
    Axios.post("http://localhost:3000/auth/login", {
      email,
      password,
    })
      .then((response) => {
        if (response.data.status) {
          navigate("/");
          const role = response.data.role;
          const token = response.data.token;
          const username = response.data.username;
          setAuth({ role, token, username });
          navigate(from, { replace: true });
        }
      })
      .catch(() => {
        toast.error("The credentials do not match with one in our system.");
      });
  }

  return (
    <>
      <Card className="mt-5 w-25 mx-auto justify-content-center align-items-center">
        <Card.Body className="w-100 p-5">
          <Card.Title>Login Form</Card.Title>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            className="loginForm"
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

            <Row className="mb-3">
              <Form.Group as={Col} md="9" controlId="passwordValidation">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="Password"
                  aria-describedby="inputGroupPrepend"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="invalid-feedback">
                  Please enter your password.
                </div>
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Button className="m-auto w-50 align-items-center" type="submit">
              Login
            </Button>
          </Form>
        </Card.Body>

        <Link to="/forgotPassword">Forgot Password?</Link>

        <p>
          Don&apos;t have an Account?<Link to="/signup"> Register</Link>
        </p>
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
