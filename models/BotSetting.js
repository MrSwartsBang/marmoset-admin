const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BotSettingSchema = new Schema({
    discord: {
        type: Boolean,
        default:true,
        required: true
    },
    telegram: {
        type: Boolean,
        default:true,
        required: true
    }
});
BotSettingSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
BotSettingSchema.set('toJSON', {
    virtuals: true
});


module.exports = BotSetting = mongoose.model("BotSetting", BotSettingSchema);
