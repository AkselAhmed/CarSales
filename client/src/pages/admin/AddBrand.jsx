import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function AddBrand() {
  const [brand, setBrand] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const confirmAdd = window.confirm(`Add ${brand} to brands?`);

    if (confirmAdd) {
      axios.defaults.withCredentials = true;
      axios
        .post("http://localhost:3000/carlist/addBrand", { brand })
        .then((res) => {
          if (res.data.status) {
            toast.success("Brand addes successfully.");
            setBrand("");
            navigate("/editBrands");
          }
        })
        .catch(() => {
          toast.error("Brand already exists.");
        });
    }
  }

  return (
    <>
      <Card className="mt-5 w-25 mx-auto justify-content-center align-items-center">
        <Card.Body>
          <Card.Title>Add Brand</Card.Title>
          <Form onSubmit={(e) => handleSubmit(e)}>
            <Form.Group className="my-4">
              Brand:
              <Form.Control
                required
                placeholder="Brand"
                type="text"
                aria-describedby="inputGroupPrepend"
                onChange={(e) => {
                  setBrand(e.target.value);
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
