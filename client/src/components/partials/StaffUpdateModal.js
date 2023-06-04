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



class StaffUpdateModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "",
            username: "",
            telegram: "",
            discord: "",
            role:"",
            img: "",
            errors: {},
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.record);
        if (nextProps.record) {
            const myVariable = nextProps?.record?.img || '';
            const startsWithPrefix = myVariable.startsWith('data:image/');
            this.setState({
                id: nextProps.record.id,
                username: nextProps.record.username,
                telegram: nextProps.record.telegram,
                discord: nextProps.record.discord,
                role: nextProps.record.role,
                img: nextProps.record.img,
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
            $('#update-user-modal').modal('hide');
            toast(nextProps.auth.user.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    onChange = e => {
        this.setState({ [e.target.id.split("-")[0]]: e.target.value });
    };
    handleImg = e => {
        try{
            var file = e.target.files[0];
            var reader = new FileReader();
            // Set the onload event handler
            reader.onload = (e) => {
              var imageDataUrl = e.target.result;
              this.setState(prevState => ({
                ...prevState,
                img: imageDataUrl,
                file:file
              }));
          
              // Perform further actions with the image data URL
            };
            // Read the selected file as a data URL
            reader.readAsDataURL(file);
        }
        catch(err){

        }
 
    }
    onStaffUpdate = e => {
        e.preventDefault();
        const options = {
            onClose: props => { 
                var modal = document.getElementById('update-staff-modal');
                $(modal).modal('hide');
                this.setState( {
                    username:"",
                    telegram: "",
                    discord:"", 
                    role:"", 
                    img: ""
                });
            }
        };


        var newStaff;
        if(this.state.file === ""){
            newStaff = {
                username: this.state.username,
                discord: this.state.discord,
                telegram: this.state.telegram,
                role: this.state.role,
                img:this.state.img
            }
        }
        else
        {
            newStaff = new FormData();
            newStaff.append('file', this.state.file);
            newStaff.append('username', this.state.username);
            newStaff.append('discord', this.state.discord);
            newStaff.append('telegram', this.state.telegram);
            newStaff.append('role', this.state.role);
        }
        axios
        .post("/api/staff-update", newStaff)
        .then(res =>{
            toast(res.data.message,options);
            this.props.getdata();
        }).catch(err =>{

        });
    };

    render() {
        
        return (
            <div>
                <div className="modal fade" id="update-staff-modal">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Update Staff</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form noValidate onSubmit={this.onStaffUpdate} id="update-staff">
                                    <input
                                        onChange={this.onChange}
                                        value={this.state.id}
                                        id="id"
                                        type="text"
                                        className="d-none"/>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Name</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.username}
                                                id="username"
                                                type="text"
                                                className={classnames("form-control")}/>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Telegram</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.telegram}
                                                id="telegram"
                                                type="text"
                                                className={classnames("form-control")}/>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Discord</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.discord}
                                                id="discord"
                                                type="text"
                                                className={classnames("form-control")}/>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Role</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.role}
                                                id="role"
                                                type="text"
                                                className={classnames("form-control")}/>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Image</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.img}
                                                id="img"
                                                type="text"
                                                className={classnames("form-control")}/>
                                        </div>
                                    </div>
                                    
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button
                                    form="update-staff"
                                    type="submit"
                                    className="btn btn-primary">
                                    Update Staff
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

StaffUpdateModal.propTypes = {
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
)(withRouter(StaffUpdateModal));
