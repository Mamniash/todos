import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Deed } from "./TodoAdd";
import { User } from "firebase/auth";

interface TodoDetailProps {
   currentUser: User | null;
   getDeed: (key: string) => Deed | undefined;
}

export default function TodoDetail(props: TodoDetailProps): JSX.Element | null {
   const { key } = useParams<{ key: string }>();
   if (typeof key !== "string") {
      return null;
   }
   const deed = props.getDeed(key) as Deed;
   if (!props.currentUser)
      return <Navigate to="/login" replace />;

   return (
      <section>
         {deed.done &&
            <p className="has-text-success">
               Выполнено
            </p>
         }
         <h1>{deed.title}</h1>
         <p>{deed.createdAt}</p>
         {deed.desc && <p>{deed.desc}</p>}
         {deed.image && <p><img src={deed.image} alt="#" /></p>}
      </section>
   )
} 