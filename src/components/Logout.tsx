import { Navigate } from "react-router-dom";
import { logout } from "../firebase/api";
import { User } from "firebase/auth";

interface LogoutProps {
   currentUser: User | null;
}

export default function Logout(props: LogoutProps): JSX.Element | null {
   if (props.currentUser) {
      logout();
      return null;
   }

   return <Navigate to="/login" replace></Navigate>
}