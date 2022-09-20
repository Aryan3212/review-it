const { CampgroundModel } = require("../models/campgroundModel");
const { db } = require("../db");

async function seed() {
    const camps = require("./cities").slice(0, 15);
    const { places, descriptors } = require("./titleDescriptors");
    const documents = [];

    await CampgroundModel.deleteMany({});
    camps.map((c) => {
        const camp = new CampgroundModel({
            title:
                descriptors[Math.floor(Math.random() * descriptors.length)] +
                " " +
                places[Math.floor(Math.random() * places.length)],
            price: Math.random() * 100,
            description: "This is the description!",
            location: {
                geometry: {
                    coordinates: [c.longitude, c.latitude],
                },
                properties: {
                    name: `${c.state}, ${c.city}`,
                },
            },
        });
        documents.push(camp);
    });

    await CampgroundModel.bulkSave(documents);
}
db.init()
    .then(seed)
    .then(() => {
        db.close();
    })
    .catch(() => {
        console.log("Seeding complete!");
    });
