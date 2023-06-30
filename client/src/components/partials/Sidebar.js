import React, { Component } from "react";
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import {Link} from "react-router-dom";

class Sidebar extends Component {

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    render() {
        //const { user } = this.props.auth;
        return (
            <div className="border-right h-100" id="sidebar-wrapper">
                <div className="list-group list-group-flush">
                    <Link to="/admin/dashboard" className="list-group-item list-group-item-action">Dashboard</Link>
                    <Link to="/admin/admin" className="list-group-item list-group-item-action">Admin</Link>
                    <Link to="/admin/Users" className="list-group-item list-group-item-action">Users</Link>
                    <Link to="/admin/carousel" className="list-group-item list-group-item-action">Carousel</Link>
                    <Link to="/admin/staff" className="list-group-item list-group-item-action">Staff</Link>
                    <Link to="/admin/about" className="list-group-item list-group-item-action">About</Link>
                    <Link to="/admin/roadmap" className="list-group-item list-group-item-action">Roadmap</Link>
                    <button className="list-group-item list-group-item-action" onClick={this.onLogoutClick}>Logout <FontAwesomeIcon icon={faSignOutAlt} /></button>
                </div>
            </div>
        );
    }
}

Sidebar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Sidebar);
