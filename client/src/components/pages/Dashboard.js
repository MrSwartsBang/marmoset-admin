import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import axios from "axios";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            buy:"",
            url:"",
            shop:""
        };

    }
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };
    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };
    onClick = e => {
        axios
        .post("/api/urldata", this.state)
        .then(res =>{
            toastr.success("URL added successfully!");
            // this.setState({});
        }).catch(err =>{

        });
    };
    componentDidMount(){
        axios.get("/api/urldata").then((res) => {
            console.log(res.data);
            this.setState(res.data);
          }).catch();
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
                            <h1 className="mt-2 text-primary">Setting URLs</h1>
                            <div className="row px-2">
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-primary text-white shadow-lg">
                                        <div className="card-body">
                                            <h5 className="card-title">BuyNFT</h5>
                                            <input type="text" id="buy" value={this.state.buy} onChange={this.onChange}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row px-2">
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-primary text-white shadow-lg">
                                        <div className="card-body">
                                            <h5 className="card-title">Events</h5>
                                            <input type="text" id="event" value={this.state.event} onChange={this.onChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row px-2">
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-primary text-white shadow-lg">
                                        <div className="card-body">
                                            <h5 className="card-title">Shop</h5>
                                            <input type="text" id="shop" value={this.state.shop} onChange={this.onChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row px-2">
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-primary text-white shadow-lg">
                                        <div className="card-body">
                                            <button onClick={this.onClick}>Save</button>
                                        </div>
                                    </div>
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
