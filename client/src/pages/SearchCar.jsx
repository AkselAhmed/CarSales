import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import { useState } from "react";
import axios from "axios";
import AdvertisementItem from "../Components/AdvertisementItem";

export default function SearchCar() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [engine, setEngine] = useState("");
  const [fromPrice, setFromPrice] = useState("");
  const [toPrice, setToPrice] = useState("");
  const [fromYear, setFromYear] = useState("");
  const [toYear, setToYear] = useState("");
  const [city, setCity] = useState("");
  const [advertisements, setAdvertisements] = useState([]);

  function handleSearch() {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/advertisement/searchFilters", {
        brand,
        model,
        engine,
        fromPrice,
        toPrice,
        fromYear,
        toYear,
        city,
      })
      .then((res) => {
        if (res.data.status) {
          setAdvertisements(res.data.advertisements);
        }
      });
  }

  return (
    <>
      <Card className="m-3 p-0">
        <Card.Body>
          <Card.Title>Search Filters</Card.Title>
          <Row className="mb-4 justify-content-between">
            <p className="w-auto pt-2">Brand: </p>
            <InputGroup className="w-25 p-0">
              <Form.Control
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                onChange={(e) => setBrand(e.target.value)}
              />
            </InputGroup>

            <p className="w-auto pt-2">Model: </p>
            <InputGroup className="w-25 p-0">
              <Form.Control
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                onChange={(e) => setModel(e.target.value)}
              />
            </InputGroup>

            <p className="w-auto pt-2">Engine: </p>
            <InputGroup className="w-25 p-0">
              <Form.Control
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                onChange={(e) => setEngine(e.target.value)}
              />
            </InputGroup>
          </Row>

          <Row className="mb-4">
            <p className="w-auto pt-2">Price: </p>
            <InputGroup className="w-25 p-0">
              <Form.Control
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                onChange={(e) => setFromPrice(e.target.value)}
              />
            </InputGroup>
            <InputGroup className="w-25 p-0">
              <p className="pt-2 px-2">&#8212;</p>
              <Form.Control
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                onChange={(e) => setToPrice(e.target.value)}
              />
            </InputGroup>
          </Row>
          <Row className="mb-4">
            <p className="w-auto pt-2">Production Year: </p>
            <InputGroup className="w-25 p-0">
              <Form.Control
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                onChange={(e) => setFromYear(e.target.value)}
              />
            </InputGroup>
            <InputGroup className="w-25 p-0">
              <p className="pt-2 px-2">&#8212;</p>
              <Form.Control
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                onChange={(e) => setToYear(e.target.value)}
              />
            </InputGroup>
          </Row>
          <Row className="mb-4">
            <p className="w-auto pt-2">City: </p>
            <InputGroup className="w-25">
              <Form.Control
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                onChange={(e) => setCity(e.target.value)}
              />
            </InputGroup>
          </Row>
          <Button onClick={handleSearch} className="w-25" variant="primary">
            Search
          </Button>
        </Card.Body>
      </Card>
      <Row>
        {advertisements.length > 0 ? (
          advertisements.map((advertisement) => (
            <AdvertisementItem
              key={advertisement._id}
              advertisement={advertisement}
            />
          ))
        ) : (
          <div className="justify-content-center align-items-center d-flex">
            No Cars Found with these filters, please try some other inputs
          </div>
        )}
      </Row>
    </>
  );
}
