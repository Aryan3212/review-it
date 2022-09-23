const { CampgroundModel } = require('../models/campgroundModel');
const { ReviewModel } = require('../models/reviewModel');
const { UserModel } = require('../models/userModel');
const { db } = require('../db');
const camps = require('./cities').slice(0, 15);
const { places, descriptors } = require('./titleDescriptors');
require('dotenv').config();
async function seed() {
  const documents = [];
  const reviews = [];
  await CampgroundModel.deleteMany({});
  await ReviewModel.deleteMany({});
  await UserModel.deleteMany({});
  const user = new UserModel({
    username: 'aryan3212',
    email: 'rahman.aryan07@gmail.com'
  });
  await UserModel.register(user, '12345');
  const user2 = new UserModel({
    username: 'user3212',
    email: 'user@gmail.com'
  });
  await UserModel.register(user2, '12345');
  let toggle = true;
  camps.forEach((c) => {
    const camp = new CampgroundModel({
      title: `${descriptors[Math.floor(Math.random() * descriptors.length)]} ${
        places[Math.floor(Math.random() * places.length)]
      }`,
      price: Math.random() * 100,
      description: 'This is the description!',
      location: {
        geometry: {
          coordinates: [c.longitude, c.latitude]
        },
        properties: {
          name: `${c.state}, ${c.city}`
        }
      },
      author: toggle ? user.id : user2.id
    });
    const review = new ReviewModel({
      rating: 4,
      details: 'This is a great campground!',
      author: user.id,
      campground: camp.id
    });
    reviews.push(review);
    const review2 = new ReviewModel({
      rating: 4,
      details: 'This is a great campground!',
      author: user2.id,
      campground: camp.id
    });
    reviews.push(review2);
    const review3 = new ReviewModel({
      rating: 4,
      details: 'This is a great campground!',
      author: user.id,
      campground: camp.id
    });
    reviews.push(review3);
    const review4 = new ReviewModel({
      rating: 4,
      details: 'This is a great campground!',
      author: user2.id,
      campground: camp.id
    });
    reviews.push(review4);
    toggle = !toggle;
    documents.push(camp);
  });

  await CampgroundModel.bulkSave(documents);
  await ReviewModel.bulkSave(reviews);
}
db.init()
  .then(seed)
  .then(() => {
    db.close();
    console.log('Seeding complete!');
  })
  .catch((e) => {
    db.close();
    console.log('An error happened!', e);
  });
