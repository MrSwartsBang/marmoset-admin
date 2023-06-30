import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./components/pages/Dashboard";
import React, { Component } from 'react';
import Login from "./components/auth/Login";
import NotFound from "./components/layout/NotFound";
import { Provider } from "react-redux";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Register from "./components/auth/Register";
import store from "./store";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap/dist/js/bootstrap';
import '../node_modules/font-awesome/css/font-awesome.css';
import '../node_modules/jquery/dist/jquery.min';
import '../node_modules/popper.js/dist/popper';

import Admin from "./components/pages/Admin";
import Users from "./components/pages/Users";
import Carousel from "./components/pages/Carousel";
import Staff from "./components/pages/Staff";
import About from "./components/pages/About";
import Roadmap from "./components/pages/Roadmap";

if (localStorage.jwtToken) {
    const token = localStorage.jwtToken;
    setAuthToken(token);
    const decoded = jwt_decode(token);
    store.dispatch(setCurrentUser(decoded));
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
        store.dispatch(logoutUser());
        window.location.href = "./admin/login";
    }
}

class App extends Component {
    render () {
        return (
            <Provider store={store}>
                <Router>
                    <div className="App">
                        <Switch>
                            <Route exact path="/admin" component={Login} />
                            <Route exact path="/admin/register" component={Register} />
                            <Route exact path="/admin/login" component={Login} />
                            <Switch>
                                <PrivateRoute exact path="/admin/dashboard" component={Dashboard} />
                                <PrivateRoute exact path="/admin/admin" component={Admin} />
                                <PrivateRoute exact path="/admin/users" component={Users} />
                                <PrivateRoute exact path="/admin/carousel" component={Carousel} />
                                <PrivateRoute exact path="/admin/staff" component={Staff} />
                                <PrivateRoute exact path="/admin/about" component={About} />
                                <PrivateRoute exact path="/admin/roadmap" component={Roadmap} />
                            </Switch>
                            <Route exact path="*" component={NotFound} />
                        </Switch>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
