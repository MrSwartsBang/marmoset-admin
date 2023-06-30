const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RoadmapSchema = new Schema({
    year: {
        type: String,
        required: true
    },
    plans:[
        String
    ]
},{timestamps:true});

RoadmapSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

RoadmapSchema.set('toJSON', {
    virtuals: true
});

module.exports = User = mongoose.model("roadmap", RoadmapSchema);
