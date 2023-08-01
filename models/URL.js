const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const URLSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
},{timestamps:true});


URLSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

URLSchema.set('toJSON', {
    virtuals: true
});

module.exports = URL = mongoose.model("url", URLSchema);
