const { Customer, validate } = require('../models/customer');
const { Employee, validateEmp } = require('../models/employee');
const { Wallet } = require('../models/wallet');
const { MirrorStar } = require('../models/mirrorStar');
const { Salon } = require('../models/salon');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
let { getEmployee } = require('../lib/uploadToSQL');
let { customerUpload } = require('../lib/uploadToSQL');

router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find().or([{ mobileNumber: req.query.mobileNumber }])
            .sort('name');
        res.send(customers);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('login Get', err.message)
    }

});
router.patch('/:id', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        const user = await Customer.findByIdAndUpdate(req.params.id,
            {
                password: req.body.password,
                updated: new Date(),

            }, { new: true });

        if (!user) return res.status(404).send({ 'message': 'Login not found.' });

        res.send(user);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Customer Patch', err.message)
    }
});
router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(
            { 'message': error.details[0].message });

        let user = await Customer.findOne({ mobileNumber: req.body.mobileNumber });
        if (user) return res.status(400).send({ 'message': 'MobileNumber already registered.' });
        req.body.email = req.body.email === undefined ? req.body.mobileNumber + '@null_email' : req.body.email;
        user = new Customer(_.pick(req.body, ['fullName', 'mobileNumber', 'countryCode', 'password', 'email']));

        // user =  new Customer({

        //     fullName: req.body.fullName,
        //     mobileNumber: req.body.mobileNumber,
        //     password: req.body.password,
        //     email: emailAddress,
        //     created: new Date(),

        // });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        console.log(user.password);
        await user.save();
        try {
            let oldBalance = await Wallet.findOne({ mobile: req.body.countryCode + req.body.mobileNumber })
            let walletData = {
                "mobile": req.body.countryCode + req.body.mobileNumber,
                "addBalance": 0,
                "oldBalance1": 0,
                "totalBalance": 0,
                "cusomter": user._id
            }
            if (!oldBalance)
                data = new Wallet(walletData);
            await data.save();
            console.log(req.body.mobileNumber, ' wallet created')
        }
        catch (err) {
            res.status(400).send({ 'message': "Wallet" + err.message });
            console.log('Wallet Error', err.message)
        }
        res.status(201).send(_.pick(user, ['_id', 'countryCode', 'mobileNumber', 'fullName', 'email']));

        //customerUpload(user, async function(result){

        //  const customer = await Customer.findByIdAndUpdate(user._id,
        //      {

        //        AccountNo: result.insertId

        //    }, { new: true });

        //  if (!customer) return res.status(404).send({ 'message': 'The customer with the given ID was not found.' });

        //   });
        // const token = user.generateAuthToken();
        // res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Login Post', err.message)
    }
});
router.get('/employee', async (req, res) => {
    try {
        const employee = await Employee.find().or([{ mobileNumber: req.query.mobileNumber }])
            .sort('name');
        res.send(employee);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('login Get', err.message)
    }

});
router.patch('/employee/:id', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        const employee = await Employee.findByIdAndUpdate(req.params.id,
            {
                password: req.body.password,
                updated: new Date(),

            }, { new: true });

        if (!employee) return res.status(404).send({ 'message': 'Login not found.' });

        res.send(employee);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Employee Patch', err.message)
    }
});
router.post('/employee', async (req, res) => {
    try {
        let response;
        let data = [];
        getEmployee(async function (result) {
            response = result;
            if (response.err) {
                console.log('Employee sync', response.err)
                return res.status(400).send({ 'message': response.err.message });
            }
            if (response != [] && response != "" && response != null) {
                const employee_1 = await Employee.find()

                for (i = 0; i < response.length; i++) {
                    flag = false;
                    ID = response[i].StylistID
                    if (employee_1 != [] && employee_1 != "" && employee_1 != null) {
                        for (j = 0; j < employee_1.length; j++) {
                            if (employee_1[j].StylistID == ID) {
                                flag = true;
                                break;
                            }
                        }
                        if (!flag) {
                            req.body.fullName = response[i].FullName;
                            req.body.Usernm = response[i].Usernm;
                            req.body.StylistID = response[i].StylistID;
                            req.body.countryCode = response[i].RegionCode;
                            req.body.dob = response[i].DOB
                            req.body.profile = response[i].PhotoDir;
                            req.body.bio = response[i].AboutMe;
                            req.body.address = response[i].Address;
                            req.body.salonID = response[i].Salon_ID;
                            req.body.branchID = response[i].Branch_ID;
                            req.body.image = response[i].HeaderImage;
                            req.body.dateReg = (new Date(response[i].DateReg)).toISOString();
                            req.body.created = (new Date(response[i].CreatedOn)).toISOString();
                            req.body.UpdatedOn = (new Date(response[i].UpdatedOn)).toISOString();
                            if (response[i].PhoneNumber === null || response[i].PhoneNumber === '') {
                                req.body.mobileNumber = '00000' + response[i].StylistID;
                            }
                            else {
                                req.body.mobileNumber = response[i].PhoneNumber;
                            }
                            if (response[i].Email === null || response[i].Email === '') {
                                req.body.email = req.body.mobileNumber + '@null_email';
                            }
                            else {
                                req.body.email = response[i].Email;
                            }
                            req.body.password = response[i].Password;
                            if (response[i].Gender === 'M')
                                req.body.gender = "male";
                            if (response[i].Gender === 'F')
                                req.body.gender = "female";


                            let employee = await Employee.findOne({ Usernm: req.body.Usernm });
                            if (employee) return res.status(400).send({ 'message': 'username already registered.' });
                            employee = new Employee(_.pick(req.body, ['fullName', 'mobileNumber', 'dob', 'countryCode', 'Usernm', 'password', 'email', 'bio', 'salon', 'gender', 'StylistID', 'profile', 'image', 'address', 'dateReg', 'created', 'UpdatedOn', 'salonID', 'branchID']));
                            const salt = await bcrypt.genSalt(10);
                            await employee.save();
                            let mirrorStar = await MirrorStar.findOne({ employee: employee.id })
                            if (mirrorStar) return res.send({ 'message': 'mirrorstar for the given employee already exists' });
                            if (mirrorStar == undefined) {
                                mirrorStar = new MirrorStar({
                                    salonID: req.body.salonID,
                                    starName: req.body.fullName,
                                    bio: req.body.bio,
                                    StylistID: response[i].StylistID,
                                    employee: employee.id,
                                    image: req.body.profile,
                                    coverImage: req.body.image
                                })
                                await mirrorStar.save();
                            }
                            employee.mirrorstar = mirrorStar.id

                            employee = await Employee.findByIdAndUpdate(employee.id,
                                {
                                    mirrorstar: employee.mirrorstar,
                                    updated: new Date(),

                                }, { new: true });
                        }
                    }
                    else {
                        req.body.fullName = response[i].FullName;
                        req.body.Usernm = response[i].Usernm;
                        req.body.StylistID = response[i].StylistID;
                        req.body.countryCode = response[i].RegionCode;
                        req.body.dob = response[i].DOB
                        req.body.profile = response[i].PhotoDir;
                        req.body.bio = response[i].AboutMe;
                        req.body.address = response[i].Address;
                        req.body.salonID = response[i].Salon_ID;
                        req.body.branchID = response[i].Branch_ID;
                        req.body.image = response[i].HeaderImage;
                        req.body.dateReg = (new Date(response[i].DateReg)).toISOString();
                        req.body.created = (new Date(response[i].CreatedOn)).toISOString();
                        req.body.UpdatedOn = (new Date(response[i].UpdatedOn)).toISOString();
                        if (response[i].PhoneNumber === null || response[i].PhoneNumber === '') {
                            req.body.mobileNumber = '00000' + response[i].StylistID;
                        }
                        else {
                            req.body.mobileNumber = response[i].PhoneNumber;
                        }
                        if (response[i].Email === null || response[i].Email === '') {
                            req.body.email = req.body.mobileNumber + '@null_email';
                        }
                        else {
                            req.body.email = response[i].Email;
                        }
                        req.body.password = response[i].Password;
                        if (response[i].Gender === 'M')
                            req.body.gender = "male";
                        if (response[i].Gender === 'F')
                            req.body.gender = "female";


                        let employee = await Employee.findOne({ Usernm: req.body.Usernm });
                        if (employee) return res.status(400).send({ 'message': 'username already registered.' });
                        employee = new Employee(_.pick(req.body, ['fullName', 'mobileNumber', 'dob', 'Usernm', 'countryCode', 'password', 'email', 'bio', 'salon', 'gender', 'StylistID', 'profile', 'image', 'address', 'dateReg', 'created', 'UpdatedOn', 'salonID', 'branchID']));
                        const salt = await bcrypt.genSalt(10);
                        employee.password = await bcrypt.hash(employee.password, salt);
                        await employee.save();
                        let mirrorStar = await MirrorStar.findOne({ employee: employee.id })
                        if (mirrorStar) return res.send({ 'message': 'mirrorstar for the given employee already exists' });
                        if (mirrorStar == undefined) {
                            mirrorStar = new MirrorStar({
                                salonID: req.body.salonID,
                                starName: req.body.fullName,
                                bio: req.body.bio,
                                StylistID: response[i].StylistID,
                                employee: employee.id,
                                image: req.body.profile,
                                coverImage: req.body.image
                            })
                            await mirrorStar.save();
                        }
                        employee.mirrorstar = mirrorStar.id

                        employee = await Employee.findByIdAndUpdate(employee.id,
                            {
                                mirrorstar: employee.mirrorstar,
                                updated: new Date(),

                            }, { new: true });

                    }


                }
                if (employee_1 != [] && employee_1 != "" && employee_1 != null) {
                    for (k = 0; k < employee_1.length; k++) {
                        ID_ = employee_1[k].StylistID
                        updated = employee_1[k].UpdatedOn
                        flag_1 = false;
                        flag_2 = false;
                        for (l = 0; l < response.length; l++) {
                            if (response[l].StylistID == ID_) {
                                flag_1 = true;
                                break;
                            }
                        }
                        if (!flag_1) {
                            var data_ = await Employee.findByIdAndDelete(employee_1[k]._id);
                            var data1_ = await MirrorStar.findByIdAndDelete(employee_1[k].mirrorstar);
                        }
                        if (flag_1) {
                            for (m = 0; m < response.length; m++) {
                                if ((response[m].UpdatedOn).toString() === (updated).toString()) {
                                    flag_2 = true;
                                    break;
                                }

                            }
                        }

                        if (!flag_2 && flag_1) {
                            for (n = 0; n < response.length; n++) {
                                if (ID_ == response[n].StylistID) {
                                    req.body.fullName = response[n].FullName;
                                    req.body.Usernm = response[n].Usernm;
                                    req.body.StylistID = response[n].StylistID;
                                    req.body.countryCode = response[n].RegionCode;
                                    req.body.dob = response[n].DOB
                                    req.body.profile = response[n].PhotoDir;
                                    req.body.bio = response[n].AboutMe;
                                    req.body.address = response[n].Address;
                                    req.body.salonID = response[n].Salon_ID;
                                    req.body.branchID = response[n].Branch_ID;
                                    req.body.image = response[n].HeaderImage;
                                    req.body.dateReg = (new Date(response[n].DateReg)).toISOString();
                                    req.body.created = (new Date(response[n].CreatedOn)).toISOString();
                                    req.body.UpdatedOn = (new Date(response[n].UpdatedOn)).toISOString();
                                    if (response[n].PhoneNumber === null || response[n].PhoneNumber === '') {
                                        req.body.mobileNumber = '00000' + response[n].StylistID;
                                    }
                                    else {
                                        req.body.mobileNumber = response[n].PhoneNumber;
                                    }
                                    if (response[n].Email === null || response[n].Email === '') {
                                        req.body.email = req.body.mobileNumber + '@null_email';
                                    }
                                    else {
                                        req.body.email = response[n].Email;
                                    }
                                    const salt = await bcrypt.genSalt(10);
                                    req.body.password = response[n].Password;
                                    req.body.password = await bcrypt.hash(req.body.password, salt);
                                    if (response[n].Gender === 'M')
                                        req.body.gender = "male";
                                    if (response[n].Gender === 'F')
                                        req.body.gender = "female";
                                    const update = await Employee.findByIdAndUpdate(employee_1[k]._id,
                                        {
                                            fullName: req.body.fullName,
                                            Usernm: req.body.Usernm,
                                            StylistID: req.body.StylistID,
                                            countryCode: req.body.countryCode,
                                            bio: req.body.bio,
                                            address: req.body.address,
                                            salonID: req.body.salonID,
                                            branchID: req.body.branchID,
                                            image: req.body.image,
                                            dateReg: req.body.dateReg,
                                            created: req.body.created,
                                            UpdatedOn: req.body.UpdatedOn,
                                            mobileNumber: req.body.mobileNumber,
                                            password: req.body.password,
                                            email: req.body.email,
                                            dob: req.body.dob,
                                            gender: req.body.gender,
                                            profile: req.body.profile,

                                        }, { new: true });
                                    const updatem = await MirrorStar.findByIdAndUpdate(employee_1[k].mirrorstar,
                                        {
                                            salonID: req.body.salonID,
                                            starName: req.body.fullName,
                                            bio: req.body.bio,
                                            StylistID: req.body.StylistID,
                                            image: req.body.profile,
                                            coverImage: req.body.image

                                        }, { new: true });
                                }

                            }
                        }

                    }
                }
                res.send({ 'message': 'Employee Synced' })
            }
            else {
                res.send({ 'message': 'No employee found' })
            }

        });

    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Login Post', err.message)
    }
});


router.post('/employee/local', async (req, res) => {
    try {
        let employee = await Employee.findOne({ mobileNumber: req.body.mobileNumber });
        if (employee) return res.status(400).send({ 'message': 'MobileNumber already registered.' });
        employee = new Employee(_.pick(req.body, ['fullName', 'mobileNumber', 'dob', 'countryCode', 'password', 'email', 'bio', 'salon', 'gender', 'StylistID', 'profile', 'image', 'address', 'dateReg', 'created', 'UpdatedOn', 'salonID', 'branchID']));
        const salt = await bcrypt.genSalt(10);
        employee.password = await bcrypt.hash(employee.password, salt);
        console.log(employee.password);
        await employee.save();
        let mirrorStar = await MirrorStar.findOne({ employee: employee.id })
        if (mirrorStar) return res.send({ 'message': 'mirrorstar for the given employee already exists' });
        if (mirrorStar == undefined) {
            mirrorStar = new MirrorStar({
                salonID: req.body.salonID,
                starName: req.body.fullName,
                bio: req.body.bio,
                StylistID: req.body.StylistID,
                employee: employee.id,
                image: req.body.profile,
                coverImage: req.body.image
            })
            await mirrorStar.save();
        }
        employee.mirrorstar = mirrorStar.id

        employee = await Employee.findByIdAndUpdate(employee.id,
            {
                mirrorstar: employee.mirrorstar,
                updated: new Date(),

            }, { new: true });


        res.send(employee)



    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Login Post', err.message)
    }
});
module.exports = router;