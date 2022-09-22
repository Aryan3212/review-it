const { CampgroundModel } = require('../models/campgroundModel');
const { ReviewModel } = require('../models/ReviewModel');
const { UserModel } = require('../models/UserModel');
const { db } = require('../db');
const camps = require('./cities').slice(0, 15);
const { places, descriptors } = require('./titleDescriptors');

async function seed() {
  const documents = [];
  const reviews = [];
  await CampgroundModel.deleteMany({});
  await ReviewModel.deleteMany({});
  await UserModel.deleteMany({});
  const user = UserModel({
    email: 'rahman.aryan07@gmail.com'
  });
  await user.save();
  camps.forEach(c => {
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
      }
    });
    const review = new ReviewModel({
      rating: 4,
      details: 'This is a great campground!',
      author: user.id,
      campground: camp.id
    });
    reviews.push(review);
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
  .catch(e => {
    db.close();
    console.log('An error happened!', e);
  });
