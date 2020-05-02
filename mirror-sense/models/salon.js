const Joi = require('joi');
const mongoose = require('mongoose');

const Salon = mongoose.model('Salon', new mongoose.Schema({

    salonName: {
        type: String,
        default: null
    },
    salonID: {
        type: Number,
        default: null,
        unique: true,
    },
    blnShow: {
        type: String,
        default: null
    },
    isHQ: {
        type: String,
        default: null
    },
    address: {
        addressLine: {
            type: String,
            default: null

        },
        addressLine1: {
            type: String,
            default: null

        },
        postCode: {
            type: Number,
            default: null

        },
        phone: {
            type: String,
            default: null

        },
        email: {
            type: String,
            default: null

        },
        regCode: {
            type: String,
            default: null

        },
        town: {
            type: String,
            default: null

        },
        state: {
            type: String,
            default: null

        },
    },
    businessHour: {
        monday: {
            type: String,
            default: null,

        },
        tuesDay: {
            type: String,
            default: null,

        },
        wednesday: {
            type: String,
            default: null,

        },
        thursday: {
            type: String,
            default: null,

        },
        friday: {
            type: String,
            default: null,

        },
        saturday: {
            type: String,
            default: null,

        },
        sunday: {
            type: String,
            default: null,

        },
    },
    geometry: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            index: "2dsphere"
        }
    },
    avgRating: {
        type: Number,
        default: 0
    },
    reviews: [{
        reviewer: String,
        review: String,
        image: String,
        rating: String
    }],

    salonImage: String,
    logo: String,

    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        default: null
    },
    whatHot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WhatHot',
        default: null
    },
    mirrorStar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MirrorStar',
        default: null
    },
    serviceCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceCategory',
        default: null
    },
    created: {
        type: Date, default: Date.now

    },
    creator: {
        type: String,
        default: null,

    },
    likes: [{
        image: {type: String},
        name: {type: String,
          default: null,
          minlength: 2,
          maxlength: 50},
          customer:{type: String,
              default: null,
              minlength: 2,
              maxlength: 50}

  }],
  likeCounter: {type: Number,
                 default: 0
              }
}));

async function createSalon(Salon) {
    const salon = new Company(Salon);

    const result = await salon.save();
    console.log('salon : ', result);
}

// function validateEmp(Salon) {
//     const schema = {
//         fullName: Joi.string(),
//         mobileNumber: Joi.string().min(5).max(15).required(),
//         countryCode: Joi.string().min(2).max(15).required(),
//         password: Joi.string().min(5).max(255).required(),
//         address: Joi.string().min(5).max(100)
//     };

//     return Joi.validate(Salon, schema);
// }

exports.Salon = Salon;
//exports.validateEmp = validateEmp;