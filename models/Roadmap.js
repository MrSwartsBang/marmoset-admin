const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RoadmapSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

RoadmapSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

RoadmapSchema.set('toJSON', {
    virtuals: true
});

module.exports = User = mongoose.model("roadmap", RoadmapSchema);
