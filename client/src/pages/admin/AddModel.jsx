import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddModel() {
  const [model, setModel] = useState("");
  const [carBrands, setCarBrands] = useState([]);
  const [currentCarBrand, setCurrentCarBrand] = useState("");

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
  }, []);

  function handleCarBrandChange(e) {
    const selectedBrand = e.target.value;

    if (!selectedBrand) {
      setCurrentCarBrand("");
      return;
    }
    setCurrentCarBrand(selectedBrand);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const confirmAdd = window.confirm(`Add ${model} to models?`);

    if (confirmAdd) {
      axios.defaults.withCredentials = true;
      axios
        .post("http://localhost:3000/carlist/addModel", {
          brand: currentCarBrand,
          model,
        })
        .then((res) => {
          if (res.data.status) {
            toast.success("Model added successfully.");
            setModel("");
            setCurrentCarBrand("");
            e.target.reset();
          }
        })
        .catch(() => {
          toast.error("Model already exists.");
        });
    }
  }

  return (
    <>
      <Card className="mt-5 w-25 mx-auto justify-content-center align-items-center">
        <Card.Body>
          <Card.Title className="mb-3">Add Model</Card.Title>
          Brands:
          <Form onSubmit={(e) => handleSubmit(e)}>
            <Form.Select required onChange={handleCarBrandChange}>
              <option value="" selected>
                Select Car Brand
              </option>
              {carBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </Form.Select>
            <Form.Group className="my-4">
              Model:
              <Form.Control
                required
                placeholder="Model"
                type="text"
                aria-describedby="inputGroupPrepend"
                onChange={(e) => {
                  setModel(e.target.value);
                }}
              />
              <Button type="submit" className="mt-3">
                Add
              </Button>
            </Form.Group>
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
