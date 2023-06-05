const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const VerifiedSchema = new Schema({
    discord: {
        type: String,
        required: true
    },
    telegram: {
        type: String,
        required: true
    },
    wallet: {
        type: String,
        required: true
    }
},{timestamps:true});

VerifiedSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

VerifiedSchema.set('toJSON', {
    virtuals: true
});

module.exports = User = mongoose.model("verified", VerifiedSchema);
