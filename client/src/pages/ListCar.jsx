import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConvertToBase64 from "../helpers/ConvertToBase64";
import useAuth from "../hooks/useAuth";

const engines = ["Diesel", "Gasoline", "Electric"];

export default function ListCar() {
  const [currentCarBrand, setCurrentCarBrand] = useState("");
  const [currentCarModel, setCurrentCarModel] = useState("");
  const [image, setImage] = useState("");
  const [carBrands, setCarBrands] = useState([]);
  const [engine, setEngine] = useState("");
  const [price, setPrice] = useState(0);
  const [city, setCity] = useState("");
  const [mileage, setMileage] = useState("");
  const [productionYear, setProductionYear] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [carModels, setCarModels] = useState([]);

  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.get("http://localhost:3000/auth/verify").then((res) => {
      if (res.data.status) {
        console.log("verified");
      } else {
        navigate("/");
      }
    });
  }, [navigate]);

  function handleCarBrandChange(e) {
    const selectedBrand = e.target.value;

    if (!selectedBrand) return;

    setCurrentCarModel("");
    setCurrentCarBrand(selectedBrand);

    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/carlist/getmodels", {
        brand: selectedBrand,
      })
      .then((res) => {
        const { models } = res.data;
        setCarModels(models);
      })
      .catch(() => {
        toast.warning("Couldn't get models for the car");
      });
  }

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:3000/carlist/getbrands")
      .then((res) => {
        const { brands } = res.data;
        setCarBrands(brands);
      })
      .catch(() => {
        toast.warning("Couldn't get models for the car");
      });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !phone ||
      !currentCarBrand ||
      !currentCarModel ||
      !engine ||
      !price ||
      !city ||
      !mileage ||
      !productionYear ||
      !image
    ) {
      toast.warning("Please fill all the requested fields.");
      return;
    }

    const advertisementDetails = {
      image,
      brand: currentCarBrand,
      model: currentCarModel,
      engine,
      price,
      city,
      productionYear,
      mileage,
      phone,
      description,
      owner: auth.username,
    };

    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/pendingAdvertisement/createAdvertisement", {
        advertisementDetails,
      })
      .then((res) => {
        if (res.data.status) {
          toast.success(
            "Request sent successfully. Your advertisement will be post when an admin approves it. You will be redirected shortly"
          );
          setTimeout(() => {
            navigate("/");
          }, 5000);
        }
      })
      .catch(() => {
        toast.warning("Couldn't post advertisement");
      });
  }

  return (
    <Form className="mt-5 w-50 mx-auto justify-content-center align-items-center">
      <Row style={{ height: 200 }} className="w-75 mb-2">
        <Form.Control
          required
          className="my-2"
          type="file"
          onChange={(e) => {
            ConvertToBase64(e)
              .then((image) => {
                setImage(image);
              })
              .catch((error) => {
                console.log(error);
              });
          }}
        />
        {image && <img className="w-50" width={50} height={130} src={image} />}
      </Row>

      <Form.Group className="my-3">
        <Form.Label htmlFor="Select">Car Brand</Form.Label>
        <Form.Select required onChange={handleCarBrandChange}>
          <option hidden>Select Car Brand</option>
          {carBrands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="TextInput">Car Model</Form.Label>
        <Form.Select
          value={currentCarModel}
          required
          onChange={(e) => setCurrentCarModel(e.target.value)}
        >
          <option hidden>Select Car Model</option>
          {carModels.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="TextInput">Engine</Form.Label>
        <Form.Select required onChange={(e) => setEngine(e.target.value)}>
          <option hidden>Select Car Engine</option>
          {engines.map((engine) => (
            <option key={engine} value={engine}>
              {engine}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Label htmlFor="price">Price</Form.Label>
      <Form.Control
        onChange={(e) => setPrice(e.target.value)}
        type="number"
        id="price"
        required
      />

      <Form.Label htmlFor="city">City</Form.Label>
      <Form.Control
        onChange={(e) => setCity(e.target.value)}
        type="text"
        id="city"
        required
      />

      <Form.Label htmlFor="mileage">Mileage (km)</Form.Label>
      <Form.Control
        onChange={(e) => setMileage(e.target.value)}
        type="number"
        id="mileage"
        required
      />

      <Form.Label htmlFor="productionYear">Production Year</Form.Label>
      <Form.Control
        onChange={(e) => setProductionYear(e.target.value)}
        type="number"
        id="productionYear"
        required
      />

      <Form.Label htmlFor="phone">Phone</Form.Label>
      <Form.Control
        onChange={(e) => setPhone(e.target.value)}
        type="text"
        id="phone"
        required
      />

      <Form.Label htmlFor="description">Description (optional)</Form.Label>
      <Form.Control
        onChange={(e) => setDescription(e.target.value)}
        className="mb-3"
        type="text"
        id="description"
      />

      <Button onClick={handleSubmit} type="submit" className="mb-5">
        Request to post your car!
      </Button>
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
    </Form>
  );
}
