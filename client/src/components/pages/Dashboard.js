import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import {Link} from "react-router-dom";
import {faUserAlt} from "@fortawesome/free-solid-svg-icons/faUserAlt";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            _id:undefined,
            buynft: "",
            events:""
        };

    }

    componentDidMount(){
        axios.get("/api/url-get").then((res) => {
            console.log(res.data);
            this.setState({
                            events:res.data.urls.events,
                            buynft:res.data.urls.buynft
                        });
        }).catch(()=>{});
    }

    onHandleChange = e => {
        e.preventDefault();
    
        const { id, value } = e.target;
        console.log({ id, value });
        this.setState({ [id]: value });
    };
    

    onSubmit = ()=>{
        console.log(this.state);
        axios
        .post("/api/url-update", this.state)
        .then(res =>{
            console.log(res.data);
            toast("URL updated successfully!", {
                position: toast.POSITION.TOP_CENTER
            });
            this.setState({
                events:res.data.urls.events,
                buynft:res.data.urls.buynft
            });
        }).catch(err =>{});
    }
    render() {
        //const { user } = this.props.auth;
        return (
            <div>
                <Navbar/>
                <div className="d-flex" id="wrapper">
                    <Sidebar/>
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button className="btn btn-link mt-2" id="menu-toggle"><FontAwesomeIcon icon={faList}/></button>
                            <h1 className="mt-2 text-primary">Dashboard</h1>
                            <div className="row px-2">
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-info text-white shadow-lg">
                                            <div className="card-body">
                                                <h5 className="card-title">Events URL</h5>
                                                <input type="text" id="events" value={this.state.events} onChange={this.onHandleChange}/>
                                            </div>
                                    </div>
                                </div>
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-dark text-white shadow-lg">
                                        <div className="card-body">
                                            <h5 className="card-title">Buy NFT URL</h5>
                                            <input type="text" id="buynft" value={this.state.buynft} onChange={this.onHandleChange}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row px-2">
                                <div className="col-sm-3 p-sm-2">
                                    <button
                                        onClick={this.onSubmit}
                                        form="add-user"
                                        type="submit"
                                        className="btn btn-primary">
                                        Update URL
                                    </button>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Dashboard.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Dashboard);
