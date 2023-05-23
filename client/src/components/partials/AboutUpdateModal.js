import React from 'react'
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateUser } from "../../actions/userActions";
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import $ from 'jquery';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';



class CarouselUpdateModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "",
            title: "",
            text: "",
            errors: {},
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.record) {
            this.setState({
                id: nextProps.record.id,
                title: nextProps.record.title,
                text: nextProps.record.text,
            })
        }
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
        if (nextProps.auth !== undefined
            && nextProps.auth.user !== undefined
            && nextProps.auth.user.data !== undefined
            && nextProps.auth.user.data.message !== undefined
            && nextProps.auth.user.data.success) {
            $('#update-about-modal').modal('hide');
            toast(nextProps.auth.user.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    onChange = e => {
        this.setState({ [e.target.id.split("-")[0]]: e.target.value });
    };
    onAboutUpdate = e => {
        e.preventDefault();
        const newAbout = {
            _id:this.state.id,
            title: this.state.title,
            text: this.state.text,
        };
        const options = {
            onClose: props => { 
                var modal = document.getElementById('update-about-modal');
                $(modal).modal('hide');
                this.setState( {
                    title: "",
                    text: "",
                });
            }
        };
        axios
        .post("/api/about-update", newAbout)
        .then(res =>{
            toast(res.data.message,options);
            this.props.getdata();
        }).catch(err =>{});
    };

    render() {
        
        return (
            <div>
                <div className="modal fade" id="update-about-modal">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Update About</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form noValidate onSubmit={this.onAboutUpdate} id="update-about">
                                    <input
                                        onChange={this.onChange}
                                        value={this.state.id}
                                        id="id"
                                        type="text"
                                        className="d-none"/>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Title</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.title}
                                                id="title"
                                                type="text"
                                                className={classnames("form-control")}/>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Text</label>
                                        </div>
                                        <div className="col-md-9">
                                            <textarea
                                                onChange={this.onChange}
                                                value={this.state.text}
                                                // error={errors.heroText}
                                                id="text-update-name"
                                                type="text"
                                                className={classnames("form-control")}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button
                                    form="update-about"
                                    type="submit"
                                    className="btn btn-primary">
                                    Update About
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

CarouselUpdateModal.propTypes = {
    updateUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { updateUser }
)(withRouter(CarouselUpdateModal));
