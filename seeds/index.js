const path = require('path')
const mongoose = require('mongoose')
const Campground = require('../models/campground');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true})
    .catch(err => {console.log(err)})


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {console.log('Database connected')});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Campground.deleteMany({})
    for(let i = 0; i < 30; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            author: '64435b2d36b7174188e7aa43',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            price: price,
            images: [{
                url: 'https://res.cloudinary.com/dqwlgvtrf/image/upload/v1682382629/YelpCamp/eeinwei0fmw9gn3l1jgt.jpg',
                filename: 'YelpCamp/eeinwei0fmw9gn3l1jgt',
              },
              {
                url: 'https://res.cloudinary.com/dqwlgvtrf/image/upload/v1682382629/YelpCamp/jtl4qpmexmqdqtqrddgv.jpg',
                filename: 'YelpCamp/jtl4qpmexmqdqtqrddgv',
              }]
        })
        await camp.save()
    }
}

seedDB().then(
    () => {mongoose.connection.close()}
);