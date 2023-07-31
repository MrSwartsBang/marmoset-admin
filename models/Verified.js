const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {checkNFTowner} = require("../utils/discordbot");

const VerifiedSchema = new Schema({
    discord: {
        type: String
       
    },
    telegram: {
        type: String
 
    },
    wallet: {
        type: String,
        required: true
    }
},{timestamps:true});

VerifiedSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

VerifiedSchema.virtual('nftCount').get(async function(){
    return await checkNFTowner(this.wallet);
});

VerifiedSchema.set('toJSON', {
    virtuals: true
});

VerifiedSchema.pre('save', async function(next) {
    const existingDocument = await this.constructor.findOne({ wallet: this.wallet });
  if (existingDocument) {
    // If a document with the same wallet address already exists
    // Throw an error to prevent saving or creating a new document
    throw new Error('Wallet address already exists');
  }
  next();
});

module.exports = User = mongoose.model("verified", VerifiedSchema);
