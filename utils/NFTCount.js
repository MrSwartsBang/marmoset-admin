const { clientAPI, APICall } = require("./getNFT");



// async function checkNFTowner(ownerAddress) {
//     // console.log("ownerAddress:",ownerAddress);
//     const allCollectionsOwned = await clientAPI("post", "/getCollections", {
//         limit: 10000,
//         offset: 0,
//         sort: -1,
//         isActive: true
//     });
//     let data = await Promise.all(
//         allCollectionsOwned?.map(async (collection) => {
//             const options = {
//                 collection_address: collection.nftContractAddress,
//                 owner: ownerAddress,
//                 limit: 10000,
//                 offset: 0,
//                 sort: -1
//             };
  
//             let { ret: dataList } = await APICall.getNFTsByOwnerAndCollection(options);
  
//             dataList = dataList.filter((item) => item.is_for_sale !== true);
            
//             const data = dataList?.map((item) => {
//                 return { ...item, stakeStatus: 0 };
//             });
  
//             collection.listNFT = data;
            
//             return collection;
//         })
//     );
//     const arr = data.filter(item => item.listNFT?.length > 0)
//               .flatMap(item => item.listNFT ?? []);
//     console.log("nftCount:",arr.length);
//     return arr.length;
//   }
  
//   checkNFTowner("ss");