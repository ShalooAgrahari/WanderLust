const Listing = require("../models/listing.js");

module.exports.index = (async (req, res) => {
    let listings = await Listing.find();
    res.render("listings/index.ejs", {listings});
});

module.exports.newListing = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.addNewListing = (async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing (req.body.listing);
    newListing.image = {url, filename};
    newListing.owner = req.user._id;

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");   
});

module.exports.showListing = (async (req, res) => {
    let {id} = req.params;
    const listing = await Listing
    .findById(id)
    .populate({path: "reviews", populate: {path: "author"}})
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing you are looking for does not Exist!");
        res.redirect("/listings");
    };
    res.render("listings/show.ejs", {listing});
});

module.exports.editListing = (async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    
    if(!listing){
        req.flash("error", "Listing not found!");
        res.redirect("/listings");
    };
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
});

module.exports.updateListing = (async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, {new: true});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated!");  
    res.redirect(`/listings/${id}`);  
    // or we can set
    // res.render("show.ejs", {listing});
});

module.exports.destroyListing = (async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
});