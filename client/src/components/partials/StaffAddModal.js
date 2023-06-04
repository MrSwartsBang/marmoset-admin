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
class StaffAdd extends React.Component {

    constructor() {
        super();
        this.state = {
            username: "",
            discord: "",
            telegram: "",
            role: "",
            img: "",
            file:""
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

    onStaff = e => {
        e.preventDefault();
        
        
        const options = {
            onClose: props => { 
                var modal = document.getElementById('add-staff-modal');
                $(modal).modal('hide');
                this.setState( {
                    username: "",
                    discord: "",
                    telegram: "",
                    role: "",
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
        .post("/api/staff-add", newStaff,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(res =>{
            toast(res.data.message,options);
            this.props.getdata();
        })
        .catch(err =>{});
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
    render() {
       
        const { errors } = this.state;
        return (
            <div>

                <div className="modal fade" id="add-staff-modal" data-reset="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Add Staff</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form noValidate onSubmit={this.onStaff} id="add-staff">
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="title">Username</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.username}
                                                id="username"
                                                type="text"
                                                // error={errors.name}
                                                className={classnames("form-control")}/>
                                            {/* <span className="text-danger">{errors.name}</span> */}
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="text">Discord</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.discord}
                                                // error={errors.heroText}
                                                id="discord"
                                                type="text"
                                                className={classnames("form-control")}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="text">Telegram</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.telegram}
                                                // error={errors.heroText}
                                                id="telegram"
                                                type="text"
                                                className={classnames("form-control")}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="text">Role</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.role}
                                                // error={errors.heroText}
                                                id="role"
                                                type="text"
                                                className={classnames("form-control")}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="img">img</label>
                                        </div>
                                        <div className="col-md-9" style={{display: "flex"}}>
                                            {
                                                this.state.img.startsWith("data:image")?<img src={this.state.img} style={{height:"500px",width:"500px"}}/>:
                                                <input
                                                autoComplete={''}
                                                onChange={this.onChange}
                                                value={this.state.img}
                                                // error={errors.img}
                                                id="img"
                                                type="text"
                                                className={classnames("form-control")}
                                            />
                                            }
                                            <input onChange={this.handleImg}
                                                id="img-file" type="file"/>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button
                                    form="add-staff"
                                    type="submit"
                                    className="btn btn-primary">
                                    Add Staff
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

StaffAdd.propTypes = {
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { addCarousel }
)(withRouter(StaffAdd));
