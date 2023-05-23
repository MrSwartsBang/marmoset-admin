import React,{useNavigate} from 'react'
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addCarousel } from "../../actions/carouselActions";
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import $ from 'jquery';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
class AboutAdd extends React.Component {

    constructor() {
        super();
        this.state = {
            title: "",
            text: "",
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
        if (nextProps.auth !== undefined
            && nextProps.auth.user !== undefined
            && nextProps.auth.user.data !== undefined
            && nextProps.auth.user.data.message !== undefined) {
            $('#add-user-modal').modal('hide');
            toast(nextProps.auth.user.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onAbout = e => {
        e.preventDefault();
        const newAbout = {
            title: this.state.title,
            text: this.state.text,
        };
        const options = {
            onClose: props => { 
                var modal = document.getElementById('add-about-modal');
                $(modal).modal('hide');
                this.setState( {
                    title: "",
                    text: ""
                });
            }
        };

        axios
        .post("/api/about-add", newAbout)
        .then(res =>{
            toast(res.data.message,options);
            this.props.getdata();
        })
        .catch(err =>{});
    };
    render() {
       
        const { errors } = this.state;
        return (
            <div>

                <div className="modal fade" id="add-about-modal" data-reset="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Add About</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form noValidate onSubmit={this.onAbout} id="add-about">
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="heroTitle">Title</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.title}
                                                id="title"
                                                type="text"
                                                // error={errors.name}
                                                className={classnames("form-control")}/>
                                            {/* <span className="text-danger">{errors.name}</span> */}
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="text">Text</label>
                                        </div>
                                        <div className="col-md-9">
                                            <textarea
                                                onChange={this.onChange}
                                                value={this.state.text}
                                                // error={errors.heroText}
                                                id="text"
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
                                    form="add-about"
                                    type="submit"
                                    className="btn btn-primary">
                                    Add About
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

AboutAdd.propTypes = {
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { addCarousel }
)(withRouter(AboutAdd));
