const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');

// ── MapTiler geocoding helper ───────────────────────────────────
async function geocodeLocation(locationStr) {
    try {
        const token = process.env.MAPTILER_TOKEN;
        if (!token || !locationStr) return null;

        const query = encodeURIComponent(locationStr.trim());
        const url = `https://api.maptiler.com/geocoding/${query}.json?key=${token}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`MapTiler HTTP ${res.status}`);

        const data = await res.json();
        if (data.features && data.features.length > 0) {
            return data.features[0].geometry; // { type:'Point', coordinates:[lng,lat] }
        }
        return null;
    } catch (err) {
        console.error('Geocoding error:', err.message);
        return null;
    }
}

// ── Controllers ─────────────────────────────────────────────────

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;

    // Geocode location and store GeoJSON geometry
    const geometry = await geocodeLocation(campground.location);
    if (geometry) campground.geometry = geometry;

    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: { path: 'author' }
    }).populate('author');

    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }

    // Fetch lightweight data for all campgrounds to power the fullscreen map
    const allCampgrounds = await Campground.find(
        { 'geometry.coordinates': { $exists: true, $not: { $size: 0 } } },
        { title: 1, location: 1, price: 1, geometry: 1, images: 1 }
    ).lean();

    // Build a GeoJSON FeatureCollection (only first image thumbnail to keep payload small)
    const allCampFeatures = allCampgrounds.map(c => ({
        type: 'Feature',
        geometry: c.geometry,
        properties: {
            id:        c._id.toString(),
            title:     c.title,
            location:  c.location,
            price:     c.price,
            thumbnail: c.images && c.images.length > 0 ? c.images[0].url : null
        }
    }));

    res.render('campgrounds/show', { campground, allCampFeatures });
};

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });

    // Re-geocode if location changed
    const geometry = await geocodeLocation(req.body.campground.location);
    if (geometry) campground.geometry = geometry;

    // Handle new image uploads
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);

    // Handle image deletions
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } }
        });
    }

    await campground.save();
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
};
