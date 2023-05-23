const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const StaffSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    telegram: {
        type: String,
        required: true
    },
    discord: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

StaffSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
StaffSchema.set('toJSON', {
    virtuals: true
});

module.exports = User = mongoose.model("staffs", StaffSchema);
