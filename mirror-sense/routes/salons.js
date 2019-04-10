
const express = require('express');

const router = express.Router();

const services =
    [
        {
            id: 's01', salonName: 'Aakarshan Beauty Parlor', sector: 'sector 19', distance: '16km', ratings: 4, address: 'B612 Eco Park East Gurgoan', mobile: 1234567, services: [
                { id: 101, name: 'hair' },
                { id: 102, name: 'nails' },
                { id: 103, name: 'beauty' },
                { id: 104, name: 'spa' }]
            ,
            bussinessHour: [
                { monday: '09:30am - 08:30pm' },
                { tuesday: '09:30am - 08:30pm' },
                { wednesday: '09:30am - 08:30pm' },
                { thursday: '09:30am - 08:30pm' },
                { friday: '09:30am - 08:30pm' },
                { saturday: 'closed' },
                { sunday: 'closed' }
            ]
        },
        {
            id: 's02', salonName: 'Meadows Wellness', sector: 'sector 18', distance: '18km', ratings: 3.5, address: 'B612 Eco Park East Gurgoan', mobile: 1234567,
            services: [
                { id: 101, name: 'hair' },
                { id: 102, name: 'nails' },
                { id: 103, name: 'beauty' },
                { id: 104, name: 'spa' }]
            ,
            bussinessHour: [
                { monday: '09:30am - 08:30pm' },
                { tuesday: '09:30am - 08:30pm' },
                { wednesday: '09:30am - 08:30pm' },
                { thursday: '09:30am - 08:30pm' },
                { friday: '09:30am - 08:30pm' },
                { saturday: 'closed' },
                { sunday: 'closed' }]
        },
        {
            id: 's03', salonName: 'Habib Hair and Beauty', sector: 'sector 29', distance: '26km', ratings: 4, address: 'B612 Earth Park East Gurgoan', mobile: 1234567,
            services: [
                { id: 101, name: 'hair' },
                { id: 102, name: 'nails' },
                { id: 103, name: 'beauty' },
                { id: 104, name: 'spa' }]
            ,
            bussinessHour: [
                { monday: '09:30am - 08:30pm' },
                { tuesday: '09:30am - 08:30pm' },
                { wednesday: '09:30am - 08:30pm' },
                { thursday: '09:30am - 08:30pm' },
                { friday: '09:30am - 08:30pm' },
                { saturday: 'closed' },
                { sunday: 'closed' }]
        },
        {
            id: 's04', salonName: 'Hair Plus Salon', sector: 'sector 10', distance: '10km', ratings: 4, address: 'B612 Moon Park East Gurgoan', mobile: 1234567,
            services: [
                { id: 101, name: 'hair' },
                { id: 102, name: 'nails' },
                { id: 103, name: 'beauty' },
                { id: 104, name: 'spa' }]
            ,
            bussinessHour: [
                { monday: '09:30am - 08:30pm' },
                { tuesday: '09:30am - 08:30pm' },
                { wednesday: '09:30am - 08:30pm' },
                { thursday: '09:30am - 08:30pm' },
                { friday: '09:30am - 08:30pm' },
                { saturday: 'closed' },
                { sunday: 'closed' }]
        },
        {
            id: 's05', salonName: 'Meadows Wellness', sector: 'sector 18', distance: '18km', ratings: 3.5, address: 'B612 Eco Sun East Gurgoan', mobile: 1234567,
            services: [
                { id: 101, name: 'hair' },
                { id: 102, name: 'nails' },
                { id: 103, name: 'beauty' },
                { id: 104, name: 'spa' }]
            ,
            bussinessHour: [
                { monday: '09:30am - 08:30pm' },
                { tuesday: '09:30am - 08:30pm' },
                { wednesday: '09:30am - 08:30pm' },
                { thursday: '09:30am - 08:30pm' },
                { friday: '09:30am - 08:30pm' },
                { saturday: 'closed' },
                { sunday: 'closed' }]
        },
    ];

router.get('/', (req, resp) => {


    resp.send(services);
}
);


module.exports = router; 