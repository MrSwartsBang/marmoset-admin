const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CarouselSchema = new Schema({
    heroTitle: {
        type: String,
        required: true
    },
    heroText: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    devices: {
        type: String
    },
    freetoplay: {
        type: String
    },
    playtoearn: {
        type: String
    },
    Status: {
        type: String
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

module.exports = Carousel = mongoose.model("carousels", CarouselSchema);
