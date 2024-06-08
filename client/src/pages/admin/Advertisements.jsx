import axios from "axios";
import Row from "react-bootstrap/Row";
import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import AdvertisementItem from "../../Components/AdvertisementItem";

export default function Advertisements() {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:3000/pendingAdvertisement/getAllAdvertisements")
      .then((res) => {
        const { advertisements } = res.data;
        setAdvertisements(advertisements);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  function handleAccept(advertisement) {
    const confirmAccept = window.confirm(
      "Are you sure you want to POST this advertisement?"
    );

    if (confirmAccept) {
      axios.defaults.withCredentials = true;
      axios
        .post("http://localhost:3000/advertisement/createAdvertisement", {
          advertisementDetails: advertisement,
        })
        .then((res) => {
          if (res.data.status) {
            axios.defaults.withCredentials = true;
            axios
              .delete(
                `http://localhost:3000/pendingAdvertisement/deleteAdvertisement/${advertisement._id}`
              )
              .then((res) => {
                if (res.data.status) {
                  console.log("Success");
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }

  function handleDeny(id) {
    const confirmDeny = window.confirm(
      "Are you sure you want to DENY this advertisement?"
    );

    if (confirmDeny) {
      axios.defaults.withCredentials = true;
      axios
        .delete(
          `http://localhost:3000/pendingAdvertisement/deleteAdvertisement/${id}`
        )
        .then((res) => {
          const { advertisements } = res.data;
          setAdvertisements(advertisements);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }

  return (
    <Row className="justify-content-center align-items-center">
      {!loading ? (
        advertisements.length > 0 ? (
          advertisements.map((advertisement) => (
            <Card key={advertisement._id} className="w-50 m-3 p-0">
              <Row>
                <Col>
                  <AdvertisementItem
                    key={advertisement._id}
                    advertisement={advertisement}
                  />
                </Col>
                <Col className="align-items-center d-flex p-2">
                  <Button
                    onClick={() => handleAccept(advertisement)}
                    variant="success"
                    className="w-auto"
                  >
                    Accept advertisement
                  </Button>

                  <Button
                    onClick={() => handleDeny(advertisement._id)}
                    variant="danger"
                    className="w-auto"
                  >
                    Deny advertisement
                  </Button>
                </Col>
              </Row>
            </Card>
          ))
        ) : (
          <p className="p-5">No pending advertisements</p>
        )
      ) : (
        <Spinner size="lg" animation="border" />
      )}
    </Row>
  );
}
