/* eslint-disable react/prop-types */
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import FormatDate from "../helpers/FormatDate";
import "../styles/AdvertisementItem.css";
import { useNavigate } from "react-router-dom";

const buttonStyle = {
  backgroundColor: "#060606",
  transition: "background-color 0.3s",

  ":hover": {
    backgroundColor: "#060606",
  },
};

export default function AdvertisementItem({ advertisement }) {
  const { image, brand, model, price, postDate, city } = advertisement;
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/advertisementInfo/${advertisement._id}`);
  }

  return (
    <Card
      onClick={handleClick}
      className="m-3 p-0 advertisement-item"
      style={{ width: "18rem" }}
    >
      <Card.Img variant="top" src={image} className="img-custom" />

      <Card.Body>
        <Card.Title>
          {brand} {model}
        </Card.Title>
        <ListGroup className="list-group-flush">
          <ListGroup.Item>Added on: {FormatDate(postDate)}</ListGroup.Item>
          <ListGroup.Item>City: {city}</ListGroup.Item>
        </ListGroup>
        <Button style={buttonStyle} variant="dark">
          {price}$
        </Button>
      </Card.Body>
    </Card>
  );
}
