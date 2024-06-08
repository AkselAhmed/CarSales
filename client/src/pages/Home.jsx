import axios from "axios";
import Row from "react-bootstrap/Row";
import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import AdvertisementItem from "../Components/AdvertisementItem";

export default function Home() {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:3000/advertisement/getAllAdvertisements")
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

  return (
    <Row className="justify-content-center align-items-center">
      {!loading ? (
        advertisements.map((advertisement) => (
          <AdvertisementItem
            key={advertisement._id}
            advertisement={advertisement}
          />
        ))
      ) : (
        <Spinner size="lg" animation="border" />
      )}
    </Row>
  );
}
