import LogoImgPath from "../assets/LogoImg.jpg";
import "bootstrap/dist/css/bootstrap.min.css";

function LogoImg() {
  return (
    <div>
      <img style={{ height: "70px" }} src={LogoImgPath} alt="Logo" />
    </div>
  );
}

export default LogoImg;
