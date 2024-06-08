import { Outlet } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
import MainNav from "./MainNav";
import AdminNav from "./AdminNav";
import useAuth from "../hooks/useAuth";

export default function AppLayout() {
  const { auth } = useAuth();

  return (
    <div>
      <MainNav />

      <main>
        <Container fluid>
          <Row>
            {auth.role === "71a*Zl936" && (
              <Col className="p-0" md={2}>
                <AdminNav />
              </Col>
            )}
            <Col className="mx-4">
              <Outlet />
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
}
