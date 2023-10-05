import { Component } from "react";
import { Navigate } from "react-router-dom";
import { add } from "./api";

export default class TodoAdd extends Component {
   constructor(props) {
      super(props);
      this.state = { redirect: false };
      this.handleTitleChange = this.handleTitleChange.bind(this);
      this.handleDescChange = this.handleDescChange.bind(this);
      this.handleImageChange = this.handleImageChange.bind(this);
      this.handleFormSubmit = this.handleFormSubmit.bind(this);
      this.clearFormData();
   }
   clearFormData() {
      this.formData = {
         title: '',
         desc: '',
         image: ''
      };
   }

   handleTitleChange(evt) {
      this.formData.title = evt.target.value;
   }
   handleDescChange(evt) {
      this.formData.desc = evt.target.value;
   }
   handleImageChange(evt) {
      const cFiles = evt.target.files;
      if (cFiles.length > 0) {
         const fileReader = new FileReader();
         const that = this;
         fileReader.onload = () => {
            that.formData.image = fileReader.result;
         }
         fileReader.readAsDataURL(cFiles[0]);
      } else this.formData.image = '';
   }
   async handleFormSubmit(evt) {
      evt.preventDefault();
      const newDeed = { ...this.formData };
      const date = new Date();
      newDeed.done = false;
      newDeed.createdAt = date.toLocaleString();
      const addedDeed = await add(this.props.currentUser, newDeed);
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