import Axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "../styles/ResetPassword.css";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [messageHidden, setMessageHidden] = useState(true);
  const { token } = useParams();

  const navigate = useNavigate();

  useEffect(
    function () {
      if (password !== confirmPassword) setMessageHidden(false);
      else setMessageHidden(true);
    },
    [password, confirmPassword]
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      return;
    }
    Axios.post("http://localhost:3000/auth/reset-password/" + token, {
      password,
    })
      .then((response) => {
        if (response.data.status) {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="my-5 sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>

        <label htmlFor="password">New Password:</label>
        <input
          type="password"
          placeholder="*****"
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="password">Confirm New Password:</label>
        <input
          type="password"
          placeholder="*****"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <p className="message-text" hidden={messageHidden}>
          Confirm password does not match password.
        </p>

        <button className="mt-5" type="submit">
          Change Password
        </button>
      </form>
    </div>
  );
}
