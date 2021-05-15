const Campground = require('../models/campground');
const pathPrefix = 'campgrounds';
//FLASH MESSAGE
const flash = require('connect-flash');

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render(`${pathPrefix}/index`, { campgrounds });
 };

 module.exports.renderNewForm = (req, res) => {
    res.render(`${pathPrefix}/new`)
 };

 module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground); 
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('succes', 'Successfully made a new campground');
    console.log(`MONGOOSE: Saved following element \n ${campground}`);
    res.redirect(`/${pathPrefix}/${campground._id}`);
 };

 module.exports.showCampground = async (req,res, next) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(campground);
    if (!campground) {
     req.flash('error', 'Cannot find that campground!');
     return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
  };

  module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params; 
    const campground = await Campground.findById(id);
    if(!campground){
       req.flash('error', 'cannot find that campground');
       res.redirect('/campgrounds');
    }
       res.render(`${pathPrefix}/edit`, { campground });
 }

 module.exports.updateCampground = async (req, res) => {
    const { id } = req.params; 
    
    campground = await Campground.findByIdAndUpdate(id, 
     {...req.body.campground});
    console.log(`MONGOOSE: Updated the following element \n ${campground}`);
    req.flash('success', 'Successfully edited a campground');
    res.redirect(`/${pathPrefix}/${campground._id}`);
 };

 module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDenodelete(id);
    console.log(`MONGOOSE: Deleted the following element 
    \n ${deletedCampground}`);
 
    req.flash('success', 'Successfully removed the campground');
    res.redirect(`/${pathPrefix}`);
 }


