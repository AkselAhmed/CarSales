import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import LogoImg from "../../public/car-heaven-logo.svg";
import axios from "axios";
import { CgProfile } from "react-icons/cg";
import { CiHeart } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/MainNav.css";

import "bootstrap/dist/css/bootstrap.min.css";
import useAuth from "../hooks/useAuth";

function ColorSchemesExample() {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const favouriteItems = useSelector(
    (state) => state?.favourites?.favouriteItems
  );

  axios.defaults.withCredentials = true;
  function handleLogout() {
    axios
      .get("http://localhost:3000/auth/logout")
      .then((res) => {
        if (res.data.status) {
          setAuth({ token: "", role: "", username: "" });

          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleLogin() {
    navigate("/login");
  }

  function handleRegister() {
    navigate("/signup");
  }

  return (
    <Navbar style={{ backgroundColor: "#060606" }} data-bs-theme="dark">
      <Container className="d-flex mx-10">
        <Navbar.Brand>
          <Link to="/">
            <img className="w-75" src={LogoImg} alt="" />
          </Link>
        </Navbar.Brand>
        <Nav className="gap-4">
          <Link
            className="text-white text-decoration-none text-uppercase"
            to="/"
          >
            Home
          </Link>
          <Link
            className="text-white text-decoration-none text-uppercase"
            to="/listcar"
          >
            List Car
          </Link>
          <Link
            className="text-white text-decoration-none text-uppercase"
            to="/searchcar"
          >
            Detailed Search
          </Link>
        </Nav>

        <Nav style={{ width: 250 }} className="gap-3 align-items-center">
          {auth.username ? (
            <>
              <Link
                className="text-black text-decoration-none position-relative"
                to={`/favourites`}
              >
                <div style={{ position: "relative", display: "inline-block" }}>
                  <CiHeart
                    style={{
                      fontSize: "32px",
                      color: "#fff",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      backgroundColor: "#990033",
                      color: "white",
                      borderRadius: "50%",
                      padding: "3px",
                      fontSize: "12px",
                      minWidth: "22px",
                      textAlign: "center",
                    }}
                  >
                    {favouriteItems?.length}
                  </span>
                </div>
              </Link>

              <button className="btn btn-md btn-custom">
                <Link
                  className="text-white text-decoration-none"
                  to={`/profile/${auth.username}`}
                >
                  <CgProfile />
                  {" " + auth.username}
                </Link>
              </button>
              <button className="btn btn-md btn-custom" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-md btn-custom"
                onClick={handleRegister}
              >
                Register
              </button>
              <button className="btn btn-md btn-custom" onClick={handleLogin}>
                Login
              </button>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default ColorSchemesExample;
