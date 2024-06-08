import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { CiWarning } from "react-icons/ci";
import { BsPeople } from "react-icons/bs";
import { FaRegRectangleList } from "react-icons/fa6";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminNav() {
  return (
    <Navbar
      variant="dark"
      expand="lg"
      style={{
        height: "100vh",
        flexDirection: "column",
        width: 200,
        backgroundColor: "#2b2b2b",
      }}
    >
      <Container fluid style={{ height: "100%" }} className="align-items-start">
        <Nav className="flex-column">
          <h3 className="fs-5" style={{ color: "#fff" }}>
            Admin Dashboard
          </h3>
          <Link
            className="text-white text-decoration-none text-uppercase nav-link"
            to="/pendingAdvertisements"
          >
            <FaRegRectangleList className="mx-2" />
            Pending Advertisements
          </Link>
          <Link
            className="text-white text-decoration-none text-uppercase nav-link"
            to="/reportedAdvertisements"
          >
            <CiWarning className="mx-2" />
            Reported Advertisements
          </Link>
          <Link
            className="text-white text-decoration-none text-uppercase nav-link"
            to="/editBrands"
          >
            <CiEdit className="mx-2" />
            Car Brands
          </Link>

          <Link
            className="text-white text-decoration-none text-uppercase nav-link"
            to="/editModel"
          >
            <CiEdit className="mx-2" />
            Car Models
          </Link>
          <Link
            className="text-white text-decoration-none text-uppercase nav-link"
            to="/allUsers"
          >
            <BsPeople className="mx-2" />
            All Users
          </Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default AdminNav;
