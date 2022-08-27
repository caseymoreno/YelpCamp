const path = require('path');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelper');
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});
const seedImages = [
    'https://res.cloudinary.com/dl5q77efo/image/upload/v1660781749/YelpCamp/lq6wv4inmf9zfprw5hrj.jpg',
    'https://res.cloudinary.com/dl5q77efo/image/upload/v1661383741/YelpCamp/seed-camp-8_fmb2rw.jpg',
    'https://res.cloudinary.com/dl5q77efo/image/upload/v1661383742/YelpCamp/seed-camp2_bfewzx.jpg',
    'https://res.cloudinary.com/dl5q77efo/image/upload/v1661383743/YelpCamp/seed-camp-3_zhabac.jpg',
    'https://res.cloudinary.com/dl5q77efo/image/upload/v1661383745/YelpCamp/seed-camp-4_ctcygf.jpg',
    'https://res.cloudinary.com/dl5q77efo/image/upload/v1661383746/YelpCamp/seed-camp-6_cvfeyn.jpg',
    'https://res.cloudinary.com/dl5q77efo/image/upload/v1661383748/YelpCamp/seed-camp-10_llaaye.jpg',
    'https://res.cloudinary.com/dl5q77efo/image/upload/v1661383748/YelpCamp/seed-camp-1_bmqcv9.jpg',
    'https://res.cloudinary.com/dl5q77efo/image/upload/v1661383750/YelpCamp/seed-camp-7_oi4zvm.jpg',
    'https://res.cloudinary.com/dl5q77efo/image/upload/v1661383751/YelpCamp/seed-camp-5_dvtj5o.jpg',
    'https://res.cloudinary.com/dl5q77efo/image/upload/v1661383751/YelpCamp/seed-camp-9_xylyvc.jpg'
];

const seedDB = async () => {
    await Campground.deleteMany({});

    for(let i = 0; i < 200; i++){
        const randomPlace = Math.floor(Math.random() * places.length);
        const randomDescriptor = Math.floor(Math.random() * descriptors.length);
        const random1000 = Math.floor(Math.random() * 1000);
        let randomCampImg = seedImages[Math.floor(Math.random() * seedImages.length)];
        let randomCampImg2 = seedImages[Math.floor(Math.random() * seedImages.length)];
        while(randomCampImg == randomCampImg2){
            randomCampImg2 = seedImages[Math.floor(Math.random() * seedImages.length)];
        }
        const camp = new Campground({
            author: '62e865da66aec4bdeec993ea',
            title: `${descriptors[randomDescriptor]} ${places[randomPlace]}`,
            price: random1000,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            images: [
                {
                    url:  randomCampImg,
                    filename: 'campImage-1'
                },
                {
                  url:  randomCampImg2,
                  filename: 'campImage-2'
                }
            ],
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non mollitia officiis accusamus ratione aperiam delectus praesentium quas et assumenda magni?'
        })
        await camp.save();
    }
}

//closing DB after insertion
seedDB().then(() => {
    mongoose.connection.close()
})