import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { useEffect, useState } from "react";
import axios from "axios";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { MdDeleteOutline } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [changeHappening, setChangeHappening] = useState(false);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:3000/auth/getAllUsers")
      .then((res) => {
        const { users } = res.data;
        setUsers(users);
      })
      .catch(() => {
        toast.warning("Something went wrong getting all users.");
      });
  }, [changeHappening]);

  function handleDelete(e) {
    e.stopPropagation();
    const username = e.target.value;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${username} from users?`
    );

    if (confirmDelete) {
      axios.defaults.withCredentials = true;
      axios
        .delete(`http://localhost:3000/auth/deleteUser/${username}`)
        .then((res) => {
          if (res.data.status) {
            toast.success("User deleted successfully.");
            setChangeHappening(!changeHappening);
          }
        })
        .catch(() => {
          toast.danger("There was an error deleting brand.");
        });
    }
  }

  function handleRoleChange(e) {
    e.stopPropagation();
    const username = e.target.value;

    const confirmRoleChange = window.confirm(
      `Are you sure you want to change roles for ${username}?`
    );

    if (confirmRoleChange) {
      axios.defaults.withCredentials = true;
      axios
        .post("http://localhost:3000/auth/changeRole", { username })
        .then((res) => {
          if (res.data.status) {
            toast.success("User role updated successfully.");
            setChangeHappening(!changeHappening);
          }
        })
        .catch(() => {
          toast.danger("There was an error updating role.");
        });
    }
  }

  return (
    <>
      <Card className="justify-content-center m-3 p-0 w-100">
        <Card.Body>
          <Row>
            <Card.Title className="w-25">Userame</Card.Title>
            <Card.Title className="w-25">Email</Card.Title>
            <Card.Title className="w-25">Role</Card.Title>
          </Row>
          <ListGroup className="list-group-flush">
            {users.map((user) => (
              <div key={user.username}>
                <ListGroup.Item
                  key={user.username}
                  className="mb-2 d-flex align-items-center"
                >
                  <Col className="w-25">{user.username}</Col>
                  <Col className="w-25">{user.email}</Col>
                  <Col className="w-25">{user.role}</Col>
                  <Col
                    style={{ width: 110 }}
                    className="d-flex justify-content-end gap-3"
                  >
                    {user.role === "user" ? (
                      <Button
                        style={{ width: 150, height: 35 }}
                        value={user.username}
                        variant="dark"
                        onClick={(e) => {
                          handleRoleChange(e);
                        }}
                      >
                        Make Admin
                      </Button>
                    ) : (
                      <Button
                        style={{ width: 150, height: 35 }}
                        value={user.username}
                        onClick={(e) => {
                          handleRoleChange(e);
                        }}
                      >
                        Make User
                      </Button>
                    )}
                    <Button
                      value={user.username}
                      onClick={(e) => handleDelete(e)}
                      variant="danger"
                      style={{ width: 50, height: 35 }}
                    >
                      <MdDeleteOutline
                        style={{ pointerEvents: "none" }}
                        value={user.username}
                      />
                    </Button>
                  </Col>
                </ListGroup.Item>
              </div>
            ))}
          </ListGroup>
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
