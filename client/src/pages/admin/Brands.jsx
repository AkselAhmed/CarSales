import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Brands() {
  const [carBrands, setCarBrands] = useState([]);
  const [open, setOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [currentBrand, setCurrentBrand] = useState("");
  const [changeHappening, setChangeHappening] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:3000/carlist/getbrands")
      .then((res) => {
        const { brands } = res.data;
        setCarBrands(brands);
      })
      .catch(() => {
        toast.warning("Something went wrong getting car brands.");
      });
  }, [changeHappening]);

  function handleDelete(e) {
    e.stopPropagation();
    const brand = e.target.value;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${brand} from brands?`
    );

    if (confirmDelete) {
      axios.defaults.withCredentials = true;
      axios
        .delete(`http://localhost:3000/carlist/deleteBrand/${brand}`)
        .then((res) => {
          if (res.data.status) {
            toast.success("Brand deleted successfully.");
            setChangeHappening(!changeHappening);
          }
        })
        .catch(() => {
          toast.danger("There was an error deleting brand.");
        });
    }
  }

  const handleOpen = (e) => {
    setCurrentBrand(e.target.value);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleSave() {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/carlist/editBrand", {
        brand: currentBrand,
        newBrand: newBrandName,
      })
      .then((res) => {
        if (res.data.status) {
          toast.success("Brand updated successfully.");
          setChangeHappening(!changeHappening);
          setOpen(false);
        }
      })
      .catch(() => {
        toast.danger("There was an error deleting brand.");
      });
  }

  return (
    <>
      <Card className="justify-content-center m-3 p-0 w-100">
        <Card.Body>
          <Card.Title>Car Brands Edit</Card.Title>
          <Button
            onClick={() => {
              navigate("/addBrand");
            }}
            className="w-25 mb-3"
          >
            Add New Brand
          </Button>
          <ListGroup className="list-group-flush">
            {carBrands.map((brand) => (
              <div key={brand}>
                <ListGroup.Item
                  key={brand}
                  className="mb-2 d-flex justify-content-between align-items-center"
                >
                  {brand}
                  <div
                    style={{ width: 110 }}
                    className="d-flex justify-content-between"
                  >
                    <Button
                      onClick={(e) => handleOpen(e)}
                      style={{ width: 50, height: 35 }}
                      value={brand}
                    >
                      <CiEdit style={{ pointerEvents: "none" }} value={brand} />
                    </Button>
                    <Button
                      value={brand}
                      onClick={(e) => handleDelete(e)}
                      variant="danger"
                      style={{ width: 50, height: 35 }}
                    >
                      <MdDeleteOutline
                        style={{ pointerEvents: "none" }}
                        value={brand}
                      />
                    </Button>
                  </div>
                </ListGroup.Item>
              </div>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
      <Modal show={open} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Brand</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup className="list-group-flush">
            <InputGroup className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-default" type="text">
                Brand
              </InputGroup.Text>
              <Form.Control
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                defaultValue={currentBrand}
                onChange={(e) => {
                  setNewBrandName(e.target.value);
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
