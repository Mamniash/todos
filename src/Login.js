import { Component } from "react";
import { Navigate } from "react-router-dom";
import { login } from "./api";

export default class Register extends Component {
   constructor(props) {
      super(props);
      this.state = {
         errorEmail: '',
         errorPassword: ''
      }
      this.handleEmailChange = this.handleEmailChange.bind(this);
      this.handlePasswordChange = this.handlePasswordChange.bind(this);
      this.handleFormSubmit = this.handleFormSubmit.bind(this);
      this.clearFormData();
   }

   clearFormData() {
      this.formData = {
         email: '',
         password: ''
      };
   }

   handleEmailChange(evt) {
      this.formData.email = evt.target.value;
   }

   handlePasswordChange(evt) {
      this.formData.password = evt.target.value;
   }

   async handleFormSubmit(evt) {
      evt.preventDefault();
      if (!this.validate())
         return;
      const result = await login(this.formData.email, this.formData.password);
      if (typeof result !== 'object')
         this.showErrorMessage(result);
   }

   resetErrorMassages() {
      this.setState(() => ({
         errorEmail: '',
         errorPassword: ''
      }));
   }

   showErrorMessage(code) {
      this.resetErrorMassages();
      if (code === 'auth/weak-password') {
         this.setState(() => ({
            errorPassword: 'Слишком простой пароль'
         }));
      };
      if (code === 'auth/invalid-login-credentials') {
         this.setState(() => ({
            errorPassword: `Пользователя <${this.formData.email}> c паролем <${this.formData.password}> не существует :()`
         }));
      };
   }

   validate() {
      this.resetErrorMassages();
      if (!this.formData.email) {
         this.setState(() => ({
            errorEmail: 'Адрес эдектронной почты не указан'
         }));
         return false;
      };
      if (!this.formData.password) {
         this.setState(() => ({
            errorPassword: 'Пароль не указан'
         }));
         return false;
      };
      return true;
   }

   render() {
      if (this.props.currentUser)
         return <Navigate to="/" replace />
      return (
         <section>
            <h1>Войти</h1>
            <form onSubmit={this.handleFormSubmit}>
               <div className="field">
                  <label className="label">Адрес электронной почты</label>
                  <div className="control">
                     <input type="email" className="input" onChange={this.handleEmailChange} />
                  </div>
                  {this.state.errorEmail &&
                     <p className="help is-danger">
                        {this.state.errorEmail}
                     </p>
                  }
               </div>
               <div className="field">
                  <label className="label">Пароль</label>
                  <div className="control">
                     <input type="password" className="input" onChange={this.handlePasswordChange} />
                  </div>
                  {this.state.errorPassword &&
                     <p className="help is-danger">
                        {this.state.errorPassword}
                     </p>
                  }
               </div>
               <div className="field is-grouped is-grouped-right">
                  <div className="control">
                     <input type="reset" className="button is-link is-light" value="Сброс" />
                  </div>
                  <div className="control">
                     <input type="submit" className="button is-primary" value="Войти" />
                  </div>
               </div>
            </form>
         </section>
      );
   }
}