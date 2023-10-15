import { Component, FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { register } from "../firebase/api";
import { User } from "firebase/auth";

interface RegisterProps {
   currentUser: User | null;
}

interface RegisterState {
   errorEmail: string;
   errorPassword: string;
   errorPasswordConfirm: string;
}

export default class Register extends Component<RegisterProps, RegisterState> {
   formData: { email: string; password: string; passwordConfirm: string; };
   constructor(props: RegisterProps) {
      super(props);
      this.state = {
         errorEmail: '',
         errorPassword: '',
         errorPasswordConfirm: ''
      }

      this.formData = {
         email: '',
         password: '',
         passwordConfirm: ''
      };

      this.handleEmailChange = this.handleEmailChange.bind(this);
      this.handlePasswordChange = this.handlePasswordChange.bind(this);
      this.handleFormSubmit = this.handleFormSubmit.bind(this);
      this.handlePasswordConfirmChange = this.handlePasswordConfirmChange.bind(this);
   }

   clearFormData(): void {
      this.formData = {
         email: '',
         password: '',
         passwordConfirm: ''
      };
   }

   resetErrorMassages(): void {
      this.setState(() => ({
         errorEmail: '',
         errorPassword: '',
         errorPasswordConfirm: ''
      }));
   }

   validate(): boolean {
      this.resetErrorMassages();
      if (!this.formData.email) {
         this.setState(() => ({
            errorEmail: 'Адрес эдектронной почты не указан'
         }));
         return false;
      }
      if (!this.formData.password) {
         this.setState(() => ({
            errorPassword: 'Пароль не указан'
         }));
         return false;
      }
      if (!this.formData.passwordConfirm) {
         this.setState(() => ({
            errorPasswordConfirm: 'Повтор пароля не указан'
         }));
         return false;
      }
      if (this.formData.password !== this.formData.passwordConfirm) {
         this.setState(() => ({
            errorPassword: 'Введенные пароли не совпадают',
            errorPasswordConfirm: 'Введенные пароли не совпадают'
         }));
         return false;
      }
      return true;
   }

   showErrorMessage(code: string): void {
      this.resetErrorMassages();
      if (code === 'auth/email-already-in-use') {
         this.setState(() => ({
            errorEmail: `Пользователь с адресом электронной почты ${this.formData.email} уже зарегистрирован`
         }));
      } else if (code === 'auth/weak-password') {
         this.setState(() => ({
            errorPassword: 'Слишком простой пароль',
            errorPasswordConfirm: 'Слишком простой пароль'
         }));
      }
   }

   handleEmailChange(evt: React.ChangeEvent<HTMLInputElement>): void {
      this.formData.email = evt.target.value;
   }

   handlePasswordChange(evt: React.ChangeEvent<HTMLInputElement>): void {
      this.formData.password = evt.target.value;
   }

   handlePasswordConfirmChange(evt: React.ChangeEvent<HTMLInputElement>): void {
      this.formData.passwordConfirm = evt.target.value;
   }

   async handleFormSubmit(evt: FormEvent<HTMLFormElement>): Promise<void> {
      evt.preventDefault();
      if (!this.validate())
         return;
      const result = await register(this.formData.email, this.formData.password);
      if (typeof result !== 'object')
         this.showErrorMessage(result);
   }

   render() {
      if (this.props.currentUser)
         return <Navigate to="/" replace />
      return (
         <section>
            <h1>Регистрация</h1>
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
               <div className="field">
                  <label className="label">Повтор пароля</label>
                  <div className="control">
                     <input type="password" className="input" onChange={this.handlePasswordConfirmChange} />
                  </div>
                  {this.state.errorPasswordConfirm &&
                     <p className="help is-danger">
                        {this.state.errorPasswordConfirm}
                     </p>
                  }
               </div>
               <div className="field is-grouped is-grouped-right">
                  <div className="control">
                     <input type="reset" className="button is-link is-light" value="Сброс" />
                  </div>
                  <div className="control">
                     <input type="submit" className="button is-primary" value="Зарегистрироваться" />
                  </div>
               </div>
            </form>
         </section>
      );
   }
}