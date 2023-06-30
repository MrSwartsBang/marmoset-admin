import React, { Component, Fragment } from "react";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import ReactDatatable from '@ashvin27/react-datatable';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import axios from "axios";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import RoadmapAddModal from "../partials/RoadmapAddModal";
import RoadmapUpdateModal from "../partials/RoadmapUpdateModal";
import { toast, ToastContainer} from "react-toastify";



const RoadmapCard = (props)=>{
    
    
    return(
        <div className="card bg-dark text-white shadow-lg marmosetCard">
            <div className="card-header">
                <h3 className="card-title">{props.record.year}</h3>
            </div>
            <div className="card-body">
                
                {
                    props.record.plans.slice(0,4).map((pl,i)=><p key={i} className="card-text">{pl}</p>)
                }
                
            </div>
            <div className="card-footer" >                    
                <button className="btn btn-light btn-primary btn-sm" 
                        data-toggle="modal"
                        data-target="#update-roadmap-modal"
                        onClick={()=>props.onEdit(props.record)} >Edit</button>
                <button className="btn btn-light" onClick={()=>props.onDelete(props.record)}>Delete</button>
            </div>

        </div>
    )
}

class Roadmap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            records: [],
            currentRecord: {
            }
        };


        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        this.getData()
    };

    componentWillReceiveProps(nextProps) {
        this.getData()
    }

    getData() {
        axios
            .get("/api/roadmap-data")
            .then(res => {
                this.setState({records:res.data});
            })
            .catch();
    }

    editRecord(record) {
        console.log(record);
        this.setState({ currentRecord: record});
    }

    deleteRecord(record) {
        console.log(record);
        axios
            .delete("/api/roadmap-delete/"+record._id)
            .then(res => {
                console.log(res.data.message);
                this.getData();
            })
            .catch();
        
    }

    pageChange(pageData) {
        console.log("OnPageChange", pageData);
    }

    render() {
        return (
            <div>
                <Navbar/>
                <div className="d-flex" id="wrapper">
                    <Sidebar/>
                    <RoadmapAddModal getData={()=>this.getData()}/>
                    <RoadmapUpdateModal record={this.state.currentRecord} getdata={()=>this.getData()}/>
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button className="btn btn-link mt-3" id="menu-toggle"><FontAwesomeIcon icon={faList}/></button>
                            <button className="btn btn-outline-primary float-right mt-3 mr-2" data-toggle="modal" data-target="#add-roadmap-modal"><FontAwesomeIcon icon={faPlus}/> Add Carousel</button>
                            <h1 className="mt-2 text-primary">Roadmap List</h1>
                            <div className="marmosetCard_Board">
                            {
                                this.state.records.map((record,index)=>{
                                    return(<RoadmapCard key={index} record={record} onDelete={()=>this.deleteRecord(record)} onEdit={()=>this.editRecord(record)}/>)})
                            }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

Roadmap.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps
)(Roadmap);
