import { Link, Navigate } from "react-router-dom";
import { Deed } from "./TodoAdd";
import { User } from "firebase/auth";

interface TodoListProps {
   currentUser: User | null;
   list: Deed[];
   setDone: (key: string) => void;
   delete: (key: string) => void;
}

export default function TodoList(props: TodoListProps): JSX.Element {
   if (!props.currentUser)
      return <Navigate to="/login" replace />;
   return (
      <section>
         <h1>Дела</h1>
         <table className="table is-hoverable is-fullwidth">
            <tbody>
               {props.list.map((item) => (
                  <tr key={item.key}>
                     <td>
                        <Link to={`/${item.key}`}>
                           {item.done && <del>{item.title}</del>}
                           {!item.done && item.title}
                        </Link>
                     </td>
                     <td>
                        <button
                           className="button is-success"
                           title="Пометить как сделанное"
                           disabled={item.done}
                           onClick={() => props.setDone(item.key)}
                        >
                           &#9745;
                        </button>
                     </td>
                     <td>
                        <button
                           className="button is-danger"
                           title="Удалить"
                           onClick={() => props.delete(item.key)}
                        >
                           &#9746;
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </section>
   );
}