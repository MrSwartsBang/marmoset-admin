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
class CarouselAdd extends React.Component {

    constructor() {
        super();
        this.state = {
            heroTitle: "",
            heroText: "",
            img: "",
            devices: "",
            freetoplay: "",
            playtoearn: "",
            Status: ""
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

    handleImg = e => {
        try{
            var file = e.target.files[0];
            var reader = new FileReader();
            // Set the onload event handler
            reader.onload = (e) => {
              var imageDataUrl = e.target.result;
              this.setState(prevState => ({
                ...prevState,
                img: imageDataUrl
              }));
          
              // Perform further actions with the image data URL
            };
            // Read the selected file as a data URL
            reader.readAsDataURL(file);
        }
        catch(err){

        }
 
    }

    onUserCarousel = e => {
        e.preventDefault();
        const newCarousel = {
            heroTitle: this.state.heroTitle,
            heroText: this.state.heroText,
            img: this.state.img,
            devices: this.state.devices,
            freetoplay: this.state.freetoplay,
            playtoearn: this.state.playtoearn,
            Status: this.state.Status
        };
        const options = {
            onClose: props => { 
                var modal = document.getElementById('add-carousel-modal');
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

        axios
        .post("/api/carousel-add", newCarousel)
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

                <div className="modal fade" id="add-carousel-modal" data-reset="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Add Carousel</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form noValidate onSubmit={this.onUserCarousel} id="add-user">
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="heroTitle">heroTitle</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.heroTitle}
                                                id="heroTitle"
                                                type="text"
                                                // error={errors.name}
                                                className={classnames("form-control")}/>
                                            {/* <span className="text-danger">{errors.name}</span> */}
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="heroText">heroText</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.heroText}
                                                // error={errors.heroText}
                                                id="heroText"
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
                                            <input
                                                autoComplete={''}
                                                onChange={this.onChange}
                                                value={this.state.img}
                                                id="img"
                                                type="text"
                                                className={classnames("form-control")}
                                            />
                                            <img src={this.state.img} style={{height:"500px",width:"500px"}}/>
                                            {/* {
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
                                                id="img-file" type="file"/> */}
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="devices">devices</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                autoComplete={''}
                                                onChange={this.onChange}
                                                value={this.state.devices}
                                                id="devices"
                                                type="text"
                                                className={classnames("form-control")}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="freetoplay">freetoplay</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                autoComplete={''}
                                                onChange={this.onChange}
                                                value={this.state.freetoplay}
                                                id="freetoplay"
                                                type="text"
                                                className={classnames("form-control")}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="playtoearn">playtoearn</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                autoComplete={''}
                                                onChange={this.onChange}
                                                value={this.state.playtoearn}
                                                id="playtoearn"
                                                type="text"
                                                className={classnames("form-control")}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="Status">Status</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                autoComplete={''}
                                                onChange={this.onChange}
                                                value={this.state.Status}
                                                id="Status"
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
                                    form="add-user"
                                    type="submit"
                                    className="btn btn-primary">
                                    Add Carousel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

CarouselAdd.propTypes = {
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { addCarousel }
)(withRouter(CarouselAdd));
