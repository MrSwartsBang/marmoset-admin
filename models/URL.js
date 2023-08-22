const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const URLSchema = new Schema({
    buy: {
        type: String,
        required: true
    },
    event: {
        type: String,
        required: true
    }
});
URLSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
URLSchema.set('toJSON', {
    virtuals: true
});


module.exports = URLData = mongoose.model("url", URLSchema);
