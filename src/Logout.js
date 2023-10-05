import { Navigate } from "react-router-dom";
import { logout } from "./api";

export default function Logout(props) {
   if (props.currentUser) {
      logout();
      return null;
   }

   return <Navigate to="/login" replace></Navigate>
}