import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();

  const goBack = () => navigate("/");

  return (
    <div>
      The page you are looking for is not found :({" "}
      <div className="flexGrow">
        <button onClick={goBack}>&larr;Back To Home</button>
      </div>
    </div>
  );
}
