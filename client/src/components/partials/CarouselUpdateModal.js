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
            heroTitle: "",
            heroText: "",
            img: "",
            devices: "",
            freetoplay: "",
            playtoearn: "",
            Status: "",
            date: "",
            errors: {},
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.record) {
            const myVariable = nextProps?.record?.img || '';
            const startsWithPrefix = myVariable.startsWith('data:image/');
            console.log(startsWithPrefix);
            this.setState({
                id: nextProps.record.id,
                heroTitle: nextProps.record.heroTitle,
                heroText: nextProps.record.heroText,
                img: nextProps.record.img,
                imgflg:startsWithPrefix,
                devices: nextProps.record.devices,
                freetoplay: nextProps.record.freetoplay,
                playtoearn: nextProps.record.playtoearn,
                Status: nextProps.record.Status,
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
    onCarouselUpdate = e => {
        e.preventDefault();
        
        const options = {
            onClose: props => { 
                var modal = document.getElementById('update-carousel-modal');
                $(modal).modal('hide');
                this.setState( {
                    heroTitle: "",
                    heroText: "",
                    img: "",
                    devices: "",
                    freetoplay: "",
                    playtoearn: "",
                    Status: ""
                });
            }
        };
        var newCarousel;
        if(this.state.file === ""){
            newCarousel = {
                heroTitle: this.state.heroTitle,
                heroText: this.state.heroText,
                img: this.state.img,
                devices: this.state.devices,
                freetoplay: this.state.freetoplay,
                playtoearn: this.state.playtoearn,
                Status: this.state.Status
            }
        }
        else
        {
            const newCarousel = new FormData();
                newCarousel.append('heroTitle', this.state.heroTitle);
                newCarousel.append('heroText', this.state.heroText);
                newCarousel.append('img', this.state.img);
                newCarousel.append('devices', this.state.devices);
                newCarousel.append('freetoplay', this.state.freetoplay);
                newCarousel.append('playtoearn', this.state.playtoearn);
                newCarousel.append('Status', this.state.Status);
        }


        axios
        .post("/api/carousel-update", newCarousel)
        .then(res =>{
            toast(res.data.message,options);
            this.props.getdata();
        }).catch(err =>{

        });
    };

    render() {
        
        return (
            <div>
                <div className="modal fade" id="update-carousel-modal">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Update Carousel</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form noValidate onSubmit={this.onCarouselUpdate} id="update-user">
                                    <input
                                        onChange={this.onChange}
                                        value={this.state.id}
                                        id="id"
                                        type="text"
                                        className="d-none"/>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">heroTitle</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.heroTitle}
                                                id="heroTitle"
                                                type="text"
                                                className={classnames("form-control")}/>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">heroText</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.heroText}
                                                id="heroText-update-name"
                                                type="text"
                                                className={classnames("form-control")}/>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">img</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                autoComplete={''}
                                                onChange={this.onChange}
                                                value={this.state.img}
                                                id="img"
                                                type="text"
                                                className={classnames("form-control")}
                                            />
                                            <img src={this.state.img} style={{height:"500px",width:"500px"}}/>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">devices</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.devices}
                                                id="devices-update-name"
                                                type="text"
                                                className={classnames("form-control")}/>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">freetoplay</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.freetoplay}
                                                id="freetoplay-update-name"
                                                type="text"
                                                className={classnames("form-control")}/>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">playtoearn</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.playtoearn}
                                                id="playtoearn-update-name"
                                                type="text"
                                                className={classnames("form-control")}/>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Status</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.Status}
                                                id="Status-update-name"
                                                type="text"
                                                className={classnames("form-control")}/>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button
                                    form="update-user"
                                    type="submit"
                                    className="btn btn-primary">
                                    Update User
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
