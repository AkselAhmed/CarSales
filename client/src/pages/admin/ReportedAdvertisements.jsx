import { useEffect, useState } from "react";
import axios from "axios";
import AdvertisementItem from "../../Components/AdvertisementItem";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReportedAdvertisements() {
  const [advertisements, setAdvertisements] = useState([]);
  const [open, setOpen] = useState(false);
  const [changeHappening, setChangeHappening] = useState(false);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:3000/advertisement/getReportedAdvertisements")
      .then((res) => {
        if (res.data.status) {
          setAdvertisements(res.data.advertisements);
        }
      })
      .catch(() => {
        toast.warning("Something went wrong getting reported advertisements.");
      });
  }, [changeHappening]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleIgnore(id) {
    const confirmIgnore = window.confirm(
      "Are you sure you want to IGNORE these reports? They will be deleted."
    );

    if (confirmIgnore) {
      axios.defaults.withCredentials = true;
      axios
        .post(
          "http://localhost:3000/advertisement/ignoreAdvertisementReports",
          {
            id,
          }
        )
        .then((res) => {
          if (res.data.status) {
            toast.success("Reports deleted successfully.");
            setChangeHappening(!changeHappening);
          }
        })
        .catch(() => {
          toast.warning("Something went wrong ignoring reports.");
        });
    }
  }

  function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to DELETE this advertisement?"
    );

    if (confirmDelete) {
      axios.defaults.withCredentials = true;
      axios
        .delete(`http://localhost:3000/advertisement/deleteAdvertisement/${id}`)
        .then((res) => {
          if (res.data.status) {
            toast.success("Advertisement deleted successfully.");
            setChangeHappening(!changeHappening);
          }
        })
        .catch(() => {
          toast.warning("Something went wrong deleting advertisement.");
        });
    }
  }

  return (
    <Row className="justify-content-center align-items-center">
      {advertisements.length > 0 ? (
        advertisements.map((advertisement) => (
          <>
            <Card key={advertisement._id} className="w-50 m-3 p-0">
              <Row key={advertisement._id}>
                <Col key={advertisement._id}>
                  <AdvertisementItem
                    key={advertisement._id}
                    advertisement={advertisement}
                  />
                </Col>
                <Col
                  style={{ width: 150 }}
                  className="align-items-center d-flex p-2"
                >
                  <Row className="justify-content-between">
                    <Button
                      style={{ width: 50 }}
                      onClick={handleOpen}
                      className="w-75 py-3 mb-4"
                      variant="info"
                    >
                      Review {advertisement.reportDescription.length} Report(s)
                    </Button>
                    <Button
                      style={{ width: 50 }}
                      onClick={() => handleIgnore(advertisement._id)}
                      variant="secondary"
                      className="w-75 py-3 mb-4"
                    >
                      Ignore Reports
                    </Button>

                    <Button
                      onClick={() => handleDelete(advertisement._id)}
                      variant="danger"
                      className="w-75 py-3"
                    >
                      Delete Advertisement
                    </Button>
                  </Row>
                </Col>
              </Row>
            </Card>
            <Modal show={open} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>
                  Total number of reports:
                  {advertisement.reportDescription.length}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ListGroup className="list-group-flush">
                  {advertisement.reportDescription.map((report, index) => (
                    <InputGroup
                      key={report}
                      className="mb-3 d-flex"
                      style={{ height: 120 }}
                    >
                      <Form.Control
                        key={advertisement._id}
                        disabled
                        as="textarea"
                        className="h-100"
                        style={{ textAlign: "left", resize: "vertical" }}
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        placeholder={`(${index + 1}) ${report}`}
                      />
                    </InputGroup>
                  ))}
                </ListGroup>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        ))
      ) : (
        <p className="py-5 px-5">There are no reported advertisements found</p>
      )}
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
    </Row>
  );
}
