import { ChangeEvent, Component, FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { add } from "../firebase/api";
import { User } from "firebase/auth";

interface TodoAddProps {
   currentUser: User | null;
   add: (addedDeed: Deed) => void;
}

interface TodoAddState {
   redirect: boolean;
}

export interface Deed {
   createdAt: string;
   desc: string | null;
   done: boolean;
   image: string | null;
   key: string;
   title: string;
}

export default class TodoAdd extends Component<TodoAddProps, TodoAddState> {
   formData: { title: string; desc: string; image: string; };
   constructor(props: TodoAddProps) {
      super(props);

      this.state = {
         redirect: false
      };

      this.formData = {
         title: '',
         desc: '',
         image: ''
      };

      this.handleTitleChange = this.handleTitleChange.bind(this);
      this.handleDescChange = this.handleDescChange.bind(this);
      this.handleImageChange = this.handleImageChange.bind(this);
      this.handleFormSubmit = this.handleFormSubmit.bind(this);
   }
   clearFormData(): void {
      this.formData = {
         title: '',
         desc: '',
         image: ''
      };
   }

   handleTitleChange(evt: ChangeEvent<HTMLInputElement>): void {
      this.formData.title = evt.target.value;
   }
   handleDescChange(evt: ChangeEvent<HTMLTextAreaElement>): void {
      this.formData.desc = evt.target.value;
   }
   handleImageChange(evt: ChangeEvent<HTMLInputElement>): void {
      const cFiles = evt.target.files;
      if (cFiles && cFiles.length > 0) {
         const fileReader = new FileReader();
         //!const that = this;
         fileReader.onload = () => {
            if (typeof fileReader.result === "string") {
               this.formData.image = fileReader.result;
            }
         }
         fileReader.readAsDataURL(cFiles[0]);
      } else this.formData.image = '';
   }
   async handleFormSubmit(evt: FormEvent<HTMLFormElement>): Promise<void> {
      evt.preventDefault();
      if (!this.props.currentUser)
         return;
      const newDeed = { ...this.formData } as Deed;
      const date = new Date();
      newDeed.done = false;
      newDeed.createdAt = date.toLocaleString();
      if (typeof this.props.currentUser !== "object") {
         return;
      }
      const addedDeed = await add(this.props.currentUser, newDeed) as Deed;
      this.props.add(addedDeed);
      this.setState(() => ({ redirect: true }));
   }

   render() {
      if (!this.props.currentUser)
         return <Navigate to="/login" replace />;
      if (this.state.redirect)
         return <Navigate to="/" />;
      return (
         <section>
            <h1>Создание нового дела</h1>
            <form onSubmit={this.handleFormSubmit}>
               <div className="field">
                  <label className="label">Заголовок</label>
                  <div className="cantrol">
                     <input type="text" className="input" onChange={this.handleTitleChange} />
                  </div>
               </div>
               <div className="field">
                  <label className="label">Примечание</label>
                  <div className="control">
                     <textarea className="textarea" onChange={this.handleDescChange}></textarea>
                  </div>
               </div>
               <div className="field">
                  <div className="file">
                     <label className="file-label">
                        <input type="file" className="file-input" accept="image/*" onChange={this.handleImageChange} />
                        <span className="file-cta">
                           <span className="file-label">
                              Графическая иллюстрация
                           </span>
                        </span>
                     </label>
                  </div>
               </div>
               <div className="field is-grouped is-grouped-right">
                  <div className="control">
                     <input type="reset" className="button is-link is-light" value={"Сброс"} />
                  </div>
                  <div className="control">
                     <input type="submit" className="button is-primary" value={"Создать новое дело"} />
                  </div>
               </div>
            </form>
         </section>
      )
   }
}