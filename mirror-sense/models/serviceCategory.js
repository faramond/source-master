

const Joi = require('joi');
const mongoose = require('mongoose');

const ServiceCategory = mongoose.model('ServiceCategory', new mongoose.Schema({

    serviceType: {
        type: String,
        default: null,
        required: true,
        unique: true

    },
    availableServices: {
        services: [{
            name: {
                type: String,
                default: null,

            },
            price: {
                type: String,
                default: null,

            },
        }]

    },

    status: {
        type: String,
        default: null,

    },
    salons: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Salons',
        default: null,
        
    },

}));

 async function createServiceCategory(serviceCategoryRequest,salon) {
    try {
        console.log('here',salon, ' ', serviceCategoryRequest.serviceCategory.salons[0]);
        salon = salon === undefined ? serviceCategoryRequest.serviceCategory.salons[0] : salon;
        console.log('new service category update',serviceCategoryRequest.serviceCategory.serviceType,salon)
        
      let ifExist = await ServiceCategory.findOne({ serviceType: serviceCategoryRequest.serviceCategory.serviceType });
        console.log("ifExist",ifExist);
        if (!ifExist) {
            console.log('new service category entry')
            let result = new ServiceCategory(serviceCategoryRequest.serviceCategory);
            await result.save();
            console.log('serviceCategory: ', result);
            return result
        }
        else {
            console.log('Inside service category update',ifExist.id)
            const result = await ServiceCategory.findByIdAndUpdate(ifExist.id,
                { $addToSet: {salons: salon}},
                { new: true },
    function(err, doc) {
        if(err){
        console.log(err);
        }
    });
        console.log(result);
        return result;
    }


    }
    catch (err) {
    return err.message;
}
}


exports.ServiceCategory = ServiceCategory;
exports.createServiceCategory = createServiceCategory;