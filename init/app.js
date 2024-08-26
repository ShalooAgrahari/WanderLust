const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
};
main()
.then(() => {
    console.log("connected database");
})
.catch((err) => {
    console.log(err);
});

const initDB = async() => {
    await Listing.deleteMany({}),
    initData.data = initData.data.map((obj) => ({...obj, owner:"66b8921e9d6b0b4c67781270"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();