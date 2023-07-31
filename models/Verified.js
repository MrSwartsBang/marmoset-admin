const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { clientAPI, APICall } = require("../utils/getNFT");

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
    const allCollectionsOwned = await clientAPI("post", "/getCollections", {
        limit: 10000,
        offset: 0,
        sort: -1,
        isActive: true
    });

    let data = await Promise.all(
        allCollectionsOwned?.map(async (collection) => {
            const options = {
                collection_address: collection.nftContractAddress,
                owner: this.wallet,
                limit: 10000,
                offset: 0,
                sort: -1
            };
  
            let { ret: dataList } = await APICall.getNFTsByOwnerAndCollection(options);
  
            dataList = dataList.filter((item) => item.is_for_sale !== true);
            
            const data = dataList?.map((item) => {
                return { ...item, stakeStatus: 0 };
            });
            collection.listNFT = data;
            return collection;
        })
    );
    const arr = data.filter(item => item.listNFT?.length > 0)
                    .flatMap(item => item.listNFT ?? []);
    return arr.length;
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
