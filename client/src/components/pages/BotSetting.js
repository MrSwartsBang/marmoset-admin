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
import Toggle from 'react-toggle'
class BotSetting extends Component {
    constructor(props){
        super(props);
        this.state = {
            discord:false,
            telegram:false
        };

    }
    onChange = e => {
        this.setState({ [e.target.id]: e.target.checked }, () => {
            axios.post("/api/botsetting", this.state)
              .then(res => {
                this.getBotSettingData();
              })
              .catch(err => {
                this.getBotSettingData();
              });
          });
          
    };
    getBotSettingData = ()=>{
        axios.get("/api/botsetting").then((res) => {
            const {discord,telegram} = res.data;
            console.log(discord,telegram);
            this.setState({ discord, telegram });
          }).catch();
    }
    componentDidMount(){
        this.getBotSettingData();
    }
    render() {
        //const { user } = this.props.auth;
        console.log(this.state);
        return (
            <div>
                <Navbar/>
                <div className="d-flex" id="wrapper">
                    <Sidebar/>
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button className="btn btn-link mt-2" id="menu-toggle"><FontAwesomeIcon icon={faList}/></button>
                            <h1 className="mt-2 text-primary">Setting Bots</h1>
                            <div className="row px-2">
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-primary text-white shadow-lg">
                                        <div className="card-body botSettingLayout">
                                            {/* <input type="text" id="buy" value={this.state.buy} onChange={this.onChange}/> */}
                                            <label>
                                                <span>Discord</span>
                                                <Toggle
                                                    id="discord"
                                                    checked={this.state.discord}
                                                    className='custom-classname'
                                                    onChange={this.onChange}
                                                />
                                                </label>

                                                <label>
                                                <span>Telegram</span>
                                                <Toggle
                                                    id="telegram"
                                                    checked={this.state.telegram}
                                                    className='custom-classname'
                                                    onChange={this.onChange}
                                                />
                                            </label>
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

BotSetting.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(BotSetting);
