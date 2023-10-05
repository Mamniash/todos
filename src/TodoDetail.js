import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function TodoDetail(props) {
   const { key } = useParams();
   const deed = props.getDeed(key);

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