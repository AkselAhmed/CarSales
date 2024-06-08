/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
