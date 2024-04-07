"use strict";

const Reservation = require("../models/reservation");
const Car = require("../models/car")

module.exports = {
  list: async (req, res) => {
     /*
            #swagger.tags = ["Reservations"]
            #swagger.summary = "List Reservations"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */
    let filters = {};
    if (!req.user.isAdmin && !req.user.isStaff) {
      filters = { userId: req.user._id };
    }
    const data = await res.getModelList(Reservation, filters, [
      { path: "userId", select: "username lastName firstName" },
      { path: "carId" },
      { path: "createdId", select: "username " },
      { path: "createdId", select: "username " },
    ]);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Reservation, filters),
      data,
    });
  },
  create: async (req, res) => {
       /*
            #swagger.tags = ["Reservations"]
            #swagger.summary = "Create Reservation"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    $ref: '#/definitions/Reservation'
                }
            }
        */

    if ((!req.user.isAdmin && !req.user.isStaff) || !req.body?.userId) {
      req.body.userId = req.user._id;
    }
    req.body.createdId = req.user._id;
    req.body.updatedId = req.user._id;
    if (!req.body.amount) {
        const carData = await Car.findOne({ _id: req.body.carId });
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);
        const days = (endDate - startDate) / (1000 * 60 * 60 * 24);
        req.body.amount = carData.pricePerDay * days;
      }
    const userReservationInDates = await Reservation.findOne({
      userId: req.body.userId,
      carId: req.body.carId,
      $nor: [
        { startDate: { $gt: req.body.endDate } },
        { endDate: { $lt: req.body.startDate } },
      ],
    });
    if (userReservationInDates) {
      res.errorStatusCode = 400;
      throw new Error(
        "It cannot be added because there is another reservation with the same date.",
        { cause: { userReservationInDates: userReservationInDates } }
      );
    } else {
      const data = await Reservation.create(req.body);
      res.status(201).send({
        error: false,
        data,
      });
    }
  },

  read: async (req, res) => {
     /*
        #swagger.tags = ["Reservations"]
        #swagger.summary = "Get Single Reservation"
    */
    let filters = {};
    if (!req.user.isAdmin && !req.user.isStaff) {
      filters = { userId: req.user.id };
    }
    const data = await Reservation.findOne({ _id: req.params.id,...filters }).populate([
        { path: 'userId', select: 'username firstName lastName' },
        { path: 'carId' },
        { path: 'createdId', select: 'username' },
        { path: 'updatedId', select: 'username' },
    ]);
    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {

    // if (!req.body.amount) {
    //     const carData = await Car.findOne({ _id: req.body.carId });
    //     const startDate = new Date(req.body.startDate);
    //     const endDate = new Date(req.body.endDate);
    //     const days = (endDate - startDate) / (1000 * 60 * 60 * 24);
    //     req.body.amount = carData.pricePerDay * days;
    //   }
    let filters={}
    req.body.updatedId = req.user._id
    if (!req.user.isAdmin && !req.user.isStaff) {
        filters.userId = req.user._id;
    }
    const data = await Reservation.updateOne( filters , req.body, {
      runValidators: true,
    });

    res.status(202).send({
      error: false,
      data,
      new: await Reservation.findOne({ _id: req.params.id }),
    });
  },
  delete: async (req, res) => {
    /*
        #swagger.tags = ["Reservations"]
        #swagger.summary = "Delete Reservation"
    */

    let filters={}
    req.body.updatedId = req.user._id
    if (!req.user.isAdmin && !req.user.isStaff) {
        filters.userId = req.user._id;
    }
    const data = await Reservation.deleteOne({...filters});
  
    res.status(data.deletedCount ? 204 : 404)({
      error: !data.deletedCount,
      data,
    });
  },
};