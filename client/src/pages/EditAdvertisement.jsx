import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConvertToBase64 from "../helpers/ConvertToBase64";

const engines = ["Diesel", "Gasoline", "Electric"];

const initialState = {
  _id: "",
  image: "",
  brand: "",
  model: "",
  engine: "",
  productionYear: 0,
  phone: "",
  mileage: 0,
  price: 0,
  city: "",
  owner: "",
  description: "",
  postDate: "",
};

export default function EditAdvertisement() {
  const [advertisement, setAdvertisement] = useState(initialState);
  const { id, username } = useParams();
  const [carBrands, setCarBrands] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get(`http://localhost:3000/advertisement/getAdvertisement/${id}`)
      .then((res) => {
        if (res.data.status) {
          setAdvertisement(res.data.advertisement);
        }
      })
      .catch(() => {
        toast.warning("Something went wrong getting advertisement.");
      });
  }, [id]);

  function handleCarBrandChange(e) {
    const selectedBrand = e.target.value;

    if (!selectedBrand) return;

    setAdvertisement({ ...advertisement, brand: selectedBrand });
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
      !advertisement.brand ||
      !advertisement.model ||
      !advertisement.engine ||
      !advertisement.price ||
      !advertisement.city ||
      !advertisement.mileage ||
      !advertisement.productionYear ||
      !advertisement.phone
    ) {
      toast.warning("Please don't leave empty fields.");
      return;
    }

    const advertisementDetails = {
      image: advertisement.image,
      brand: advertisement.brand,
      model: advertisement.model,
      engine: advertisement.engine,
      price: advertisement.price,
      city: advertisement.city,
      productionYear: advertisement.productionYear,
      mileage: advertisement.mileage,
      phone: advertisement.phone,
      description: advertisement.description,
      owner: advertisement.owner,
    };

    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/advertisement/editAdvertisement", {
        id: advertisement._id,
        advertisementDetails,
      })
      .then((res) => {
        if (res.data.status) {
          toast.success("Advertisement updated successfully.");

          setTimeout(() => {
            navigate(`/profile/${username}/advertisements`);
          }, 3000);
        }
      })
      .catch(() => {
        toast.danger("There was an error updating your advertisement.");
      });
  }

  return (
    <Form
      onSubmit={handleSubmit}
      className="mt-5 w-50 mx-auto justify-content-center align-items-center"
    >
      <Row style={{ height: 200 }} className="w-75 mb-2">
        <Form.Control
          className="my-2"
          type="file"
          onChange={(e) => {
            ConvertToBase64(e)
              .then((image) => {
                setAdvertisement({ ...advertisement, image });
              })
              .catch((error) => {
                console.log(error);
              });
          }}
        />
        {advertisement.image && (
          <img
            className="w-50"
            width={50}
            height={130}
            src={advertisement.image}
          />
        )}
      </Row>

      <Form.Group className="my-3">
        <Form.Label htmlFor="Select">Car Brand</Form.Label>
        <Form.Select onChange={handleCarBrandChange}>
          <option value="" disabled selected>
            {advertisement.brand + "(current)"}
          </option>
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
          value={advertisement.model}
          onChange={(e) =>
            setAdvertisement({ ...advertisement, model: e.target.value })
          }
        >
          <option value="" disabled selected>
            {advertisement.model + "(current)"}
          </option>
          {carModels.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="TextInput">Engine</Form.Label>
        <Form.Select
          onChange={(e) =>
            setAdvertisement({ ...advertisement, engine: e.target.value })
          }
        >
          <option value="" selected>
            {advertisement.engine}
          </option>
          {engines.map((engine) => (
            <option key={engine} value={engine}>
              {engine}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Label htmlFor="price">Price</Form.Label>
      <Form.Control
        value={advertisement.price}
        onChange={(e) =>
          setAdvertisement({ ...advertisement, price: e.target.value })
        }
        type="number"
        id="price"
      />

      <Form.Label htmlFor="city">City</Form.Label>
      <Form.Control
        value={advertisement.city}
        onChange={(e) =>
          setAdvertisement({ ...advertisement, city: e.target.value })
        }
        type="text"
        id="city"
      />

      <Form.Label htmlFor="mileage">Mileage (km)</Form.Label>
      <Form.Control
        value={advertisement.mileage}
        onChange={(e) =>
          setAdvertisement({ ...advertisement, mileage: e.target.value })
        }
        type="number"
        id="mileage"
      />

      <Form.Label htmlFor="productionYear">Production Year</Form.Label>
      <Form.Control
        value={advertisement.productionYear}
        onChange={(e) =>
          setAdvertisement({ ...advertisement, productionYear: e.target.value })
        }
        type="number"
        id="productionYear"
      />

      <Form.Label htmlFor="phone">Phone</Form.Label>
      <Form.Control
        value={advertisement.phone}
        onChange={(e) =>
          setAdvertisement({ ...advertisement, phone: e.target.value })
        }
        type="text"
        id="phone"
      />

      <Form.Label htmlFor="description">Description (optional)</Form.Label>
      <Form.Control
        value={advertisement.description}
        onChange={(e) =>
          setAdvertisement({ ...advertisement, description: e.target.value })
        }
        className="mb-3"
        type="text"
        id="description"
      />

      <Button type="submit">Save Changes</Button>
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
