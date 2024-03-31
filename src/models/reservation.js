"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- *
{
    "userId": "65343222b67e9681f937f001",
    "carId": "65352f518a9ea121b1ca5001",
    "startDate": "2023-10-10",
    "endDate": "2023-10-16"
}
{
    "userId": "65343222b67e9681f937f002",
    "carId": "65352f518a9ea121b1ca5002",
    "startDate": "2023-10-14",
    "endDate": "2023-10-20"
}
/* ------------------------------------------------------- */
// Reservation Model:


const ReservationSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true,
    },

    startDate: {
        type: Date,
        required: true,
        default: Date.now // Bu satırda Date.now() olarak değiştirilebilir
     },

   endDate: {
    type: Date,
    required: true,
    validate: {
        validator: function(date) {
            // departureDate'in arrivalDate'den sonra olduğunu kontrol et
            return date > this.arrivalDate;
        },
        message: 'departureDate must be later than arrivalDate'
    }
   },


}, {
    collection: 'reservations',
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
});

module.exports = mongoose.model('Reservation', ReservationSchema);