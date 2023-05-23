const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CarouselSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }

});


CarouselSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

CarouselSchema.set('toJSON', {
    virtuals: true
});

module.exports = Carousel = mongoose.model("abouts", CarouselSchema);
