import { HashRouter, Routes, Route, NavLink } from "react-router-dom";
import { Component, SyntheticEvent } from "react";
import TodoList from "./components/TodoList";
import TodoAdd, { Deed } from "./components/TodoAdd";
import TodoDetail from "./components/TodoDetail";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import Register from "./components/Register";
import firebaseApp from "./firebase/firebase";
import Logout from "./components/Logout";
import Login from "./components/Login";
import { getList, setDone, del } from "./firebase/api";

interface AppState {
   data: Deed[];
   showMenu: boolean;
   currentUser: User | null;
}

interface AppProps { }

export default class App extends Component<AppProps, AppState> {
   constructor(props: AppProps) {
      super(props);
      this.state = {
         data: [],
         showMenu: false,
         currentUser: null
      };
      this.setDone = this.setDone.bind(this);
      this.delete = this.delete.bind(this);
      this.add = this.add.bind(this);
      this.showMenu = this.showMenu.bind(this);
      this.getDeed = this.getDeed.bind(this);
      this.authStateChanged = this.authStateChanged.bind(this);
   }

   async setDone(key: string) {
      if (!this.state.currentUser)
         return;
      await setDone(this.state.currentUser, key);
      const deed = this.state.data.find((current) => current.key === key);
      if (deed)
         deed.done = true;
      this.setState(() => ({}));
   }
   async delete(key: string) {
      if (!this.state.currentUser)
         return;
      await del(this.state.currentUser, key);
      const newData = this.state.data.filter((current) => current.key !== key);
      this.setState(() => ({ data: newData }));
   }
   add(deed: Deed) {
      this.state.data.push(deed);
      this.setState(() => ({}));
   }

   showMenu(evt: SyntheticEvent) {
      evt.preventDefault();
      this.setState((state) => ({ showMenu: !state.showMenu }))
   }
   getDeed(key: string) {
      return this.state.data.find((current) => current.key === key);
   }
   async authStateChanged(user: User | null) {
      this.setState(() => ({ currentUser: user }));
      if (user) {
         const newDeed = await getList(user);
         this.setState(() => ({ data: newDeed }));
      } else
         this.setState(() => ({ data: [] }));
   }
   componentDidMount() {
      onAuthStateChanged(getAuth(firebaseApp), this.authStateChanged);
   }

   render() {
      return (
         <HashRouter>
            <nav className="navbar is-light">
               <div className="navbar-brand">
                  <NavLink
                     to="/"
                     className={({ isActive }) => 'navbar-item is-uppercase' + (isActive ? ' is-active' : '')}>
                     {this.state.currentUser ? this.state.currentUser.email : 'Todos'}
                  </NavLink>
                  <a href="/"
                     className={this.state.showMenu ? 'navbar-burger is-active' : 'navbar-burger'}
                     onClick={this.showMenu}>
                     <span></span>
                     <span></span>
                     <span></span>
                  </a>
               </div>
               <div className={this.state.showMenu ? 'navbar-menu is-active' : 'navbar-menu'}
                  onClick={this.showMenu}>
                  <div className="navbar-start">
                     {this.state.currentUser && (
                        <NavLink
                           to="/add"
                           className={({ isActive }) => 'navbar-item' + (isActive ? ' is-active' : '')}>
                           Создать дело
                        </NavLink>
                     )}
                     {this.state.currentUser && (
                        <div className="navbar-end">
                           <NavLink to="/logout"
                              className={({ isActive }) => 'navbar-item' + (isActive ? ' is-active' : '')}>
                              Выйти
                           </NavLink>
                        </div>
                     )}
                     {!this.state.currentUser && (
                        <div className="navbar-end">
                           <NavLink to="/login"
                              className={({ isActive }) => 'navbar-item' + (isActive ? ' is-active' : '')}>
                              Войти
                           </NavLink>
                        </div>
                     )}
                     {!this.state.currentUser && (
                        <NavLink
                           to="/register"
                           className={({ isActive }) => 'navbar-item' + (isActive ? ' is-active' : '')}>
                           Зарегистрироваться
                        </NavLink>
                     )}
                  </div>
               </div>
            </nav>
            <main className="content px-6 mt-6">
               <Routes>
                  <Route path="/" element={
                     <TodoList
                        list={this.state.data}
                        setDone={this.setDone}
                        delete={this.delete}
                        currentUser={this.state.currentUser} />
                  } />
                  <Route path="/add" element={
                     <TodoAdd add={this.add} currentUser={this.state.currentUser} />
                  } />
                  <Route path="/:key" element={
                     <TodoDetail
                        getDeed={this.getDeed}
                        currentUser={this.state.currentUser} />
                  } />
                  <Route path="/register" element={
                     <Register currentUser={this.state.currentUser} />
                  } />
                  <Route path="/logout" element={
                     <Logout currentUser={this.state.currentUser} />
                  } />
                  <Route path="/login" element={
                     <Login currentUser={this.state.currentUser} />
                  } />
               </Routes>
            </main>
         </HashRouter>
      );
   }
}

