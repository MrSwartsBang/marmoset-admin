import React,{useEffect, useNavigate, useState} from 'react'
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';

const PlanCom = ({info,onChangePlan,index})=>{
    return(
        <div className="row mt-2">
            <div className="col-md-3">
                <label htmlFor={`plan${index}`}>{`Plan ${index+1}`}</label>
            </div>
            <div className="col-md-9">
                <input
                    onChange={onChangePlan}
                    value={info}
                    id={`plan${index}`}
                    type="text"
                    className={classnames("form-control")}
                />
            </div>
        </div>
    )
}

class RoadmapAdd extends React.Component {

    constructor() {
        super();
        this.state = {
            year: "",
            plans:[
                "",
                "",
                "",
                ""
            ]
        };
    }
    componentWillReceiveProps(nextProps) {
       
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };
    onChangePlan = e => {
        var planChange = this.state.plans;
            planChange[Number(e.target.id.replace("plan",""))] = e.target.value;
        this.setState({ plans: planChange });
    };
    onClick = e => {
        // this.setState({ ["plans"]:  });
        var planArr = this.state.plans.push("");
        this.setState({...this.state,planArr});
    };

    onUserRoadmap = e => {
        e.preventDefault();
        console.log(this.state.plans);
        const newRoadmap = {
            year:this.state.year,
            plans:this.state.plans
        }
        axios
        .post("/api/roadmap-add", newRoadmap)
        .then(res =>{
            this.props.getData();
        }).catch(err =>{

        });

    };

    render() {
        const { errors } = this.state;
        return (
            <div>
                <div className="modal fade" id="add-roadmap-modal" data-reset="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Add Roadmap</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form noValidate onSubmit={this.onUserRoadmap} id="add-roadmap">
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="year">Year</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.year}
                                                id="year"
                                                type="date"
                                                className={classnames("form-control")}/>
                                        </div>
                                    </div>
                                    {
                                        this.state.plans.map((info,index)=> <PlanCom info={info} index={index} onChangePlan={this.onChangePlan} />)
                                    }
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={this.onClick} >Add Plan</button>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button
                                    form="add-roadmap"
                                    type="submit"
                                    className="btn btn-primary">
                                    Add Roadmap
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

RoadmapAdd.propTypes = {
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    {  }
)(withRouter(RoadmapAdd));
