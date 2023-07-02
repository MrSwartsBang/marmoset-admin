import React,{useEffect, useState} from 'react'
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
toastr.options = {
  hideDuration: 500,
  timeOut: 3000
}

const PlanCom = ({info,onChangePlan,index})=>{
    const [planinfo,setPlanInfo] = useState("---");
    useEffect(()=>{
        setPlanInfo(info);
    },[info]);
    return(
        <div className="row mt-2">
            <div className="col-md-3">
                <label htmlFor={`plan${index}`}>{`Plan ${index+1}`}</label>
            </div>
            <div className="col-md-9">
                {
                    console.log(planinfo)
                }
                <input
                    type="text"
                    onChange={onChangePlan}
                    value={planinfo}
                    id={`plan${index}`}
                    className={classnames("form-control")}
                />
            </div>
        </div>
    )
}

class RoadmapUpdate extends React.Component {

    constructor() {
        super();
        this.state = {
            year: "",
            plans:[
            ]
        };
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onUserRoadmap = this.onUserRoadmap.bind(this);
        this.onChangePlan = this.onChangePlan.bind(this);
    }
    componentWillReceiveProps(nextProps,prev) {
            this.setState(nextProps.record);
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
        var planArr = this.state.plans.push("");
        this.setState({...this.state,planArr});
    };

    onUserRoadmap = e => {
        e.preventDefault();
        axios
        .patch("/api/roadmap-update", this.state)
        .then(res =>{
            this.props.getData();
            toastr.success(res.data.message);
            this.setState({});
        }).catch(err =>{

        });

    };

    render() {
        const { errors } = this.state;
        return (
            <div>
                <div className="modal fade" id="update-roadmap-modal" data-reset="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Update Roadmap</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form noValidate onSubmit={this.onUserRoadmap} id="update-roadmap">
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
                                        this.state.plans.map((info,index)=> <PlanCom info={info} key={index} index={index} onChangePlan={this.onChangePlan} />)
                                    }
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={this.onClick} >Add Plan</button>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button
                                    form="update-roadmap"
                                    type="submit"
                                    className="btn btn-primary">
                                    Update Roadmap
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

RoadmapUpdate.propTypes = {
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    {  }
)(withRouter(RoadmapUpdate));
