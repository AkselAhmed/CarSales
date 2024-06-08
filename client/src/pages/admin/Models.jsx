import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

export default function Models() {
  const [carBrands, setCarBrands] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [changeHappening, setChangeHappening] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState("");
  const [modelsList, setModelsList] = useState([{ model: "" }]);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:3000/carlist/getbrands")
      .then((res) => {
        if (res.data.status) {
          const { brands } = res.data;
          setCarBrands(brands);
        }
      })
      .catch(() => {
        toast.warning("Error getting car brands.");
      });
  }, []);

  useEffect(() => {
    if (currentBrand) {
      axios.defaults.withCredentials = true;
      axios
        .post("http://localhost:3000/carlist/getmodels", {
          brand: currentBrand,
        })
        .then((res) => {
          if (res.data.status) {
            setCarModels(res.data.models);
          }
        })
        .catch(() => {
          toast.warning("Error getting models. Are there any?");
        });
    }
  }, [currentBrand, changeHappening]);

  useEffect(() => {
    if (currentBrand && carModels.length > 0) {
      setModelsList(carModels.map((model) => ({ model: model })));
    } else {
      setModelsList([{ model: "" }]);
    }
  }, [currentBrand, carModels, changeHappening]);

  const handleOpen = (e) => {
    const selectedBrand = e.target.value;
    setCurrentBrand(selectedBrand);
    setChangeHappening(!changeHappening);

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleModelAdd() {
    setModelsList([...modelsList, { model: "" }]);
  }

  function handleModelRemove(index) {
    const list = [...modelsList];
    list.splice(index, 1);
    setModelsList(list);
  }

  function handleSave() {
    const models = modelsList.map(({ model }) => model);

    if (modelsList) {
      axios.defaults.withCredentials = true;
      axios
        .post("http://localhost:3000/carlist/editModels", {
          brand: currentBrand,
          models,
        })
        .then((res) => {
          if (res.data.status) {
            toast.success("Changes made successfully.");
            setOpen(false);
          }
        })
        .catch(() => {
          toast.danger("There was an error updating models.");
        });
    }
  }

  return (
    <>
      <Card className="justify-content-center m-3 p-0 w-100">
        <Card.Body>
          <Card.Title className="mb-4">Car Models Edit</Card.Title>

          <ListGroup className="list-group-flush">
            {carBrands.length > 0
              ? carBrands.map((brand) => (
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
                          <CiEdit
                            style={{ pointerEvents: "none" }}
                            value={brand}
                          />
                        </Button>
                      </div>
                    </ListGroup.Item>
                  </div>
                ))
              : "No Car Brands Found"}
          </ListGroup>
        </Card.Body>
      </Card>
      <Modal show={open} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Models</Modal.Title>
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
                disabled
              />
            </InputGroup>

            {modelsList.map((model, index) => (
              <InputGroup className="mb-3" key={index}>
                <Form.Control
                  aria-label="Default"
                  aria-describedby="inputGroup-sizing-default"
                  value={model.model}
                  onChange={(e) => {
                    const updatedModelsList = [...modelsList];
                    updatedModelsList[index].model = e.target.value;
                    setModelsList(updatedModelsList);
                  }}
                />
                <Button
                  variant="danger"
                  className="w-25"
                  onClick={() => handleModelRemove(index)}
                >
                  Remove
                </Button>
              </InputGroup>
            ))}

            <Button className="w-25" onClick={handleModelAdd}>
              +
            </Button>
          </ListGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={handleSave} variant="primary">
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
