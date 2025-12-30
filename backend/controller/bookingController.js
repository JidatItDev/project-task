const { Booking, User } = require('../models');
const { Op } = require('sequelize');
const handleError = require('../utils/errorHandle');

const createBooking = async (req, res) => {
  try {
    const { userId, startTime, endTime, notes } = req.body;

    const reuqiredFields = ["userId", "startTime", "endTime"];
    const missingFields = reuqiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).send({
        message: "Missing required fields",
        missingFields: missingFields.join(", ")
      });
    }
    
    // validating right time:

    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time',
      });
    }

    //preventing same slot booking 
    const sameSlot = await Booking.findOne({
      where: {
        startTime,
        endTime,
      },
    });

    if (sameSlot) {
      return res.status(409).json({
        success: false,
        message: 'This exact time slot is already requested',
      });
    }

    //checking the booked time slot:
    const conflict = await Booking.findOne({
      where: {
        status: 'accepted',
        [Op.or]: [
          {
            startTime: {
              [Op.between]: [startTime, endTime],
            },
          },
          {
            endTime: {
              [Op.between]: [startTime, endTime],
            },
          },
          {
            [Op.and]: [
              { startTime: { [Op.lte]: startTime } },
              { endTime: { [Op.gte]: endTime } },
            ],
          },
        ],
      },
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked',
      });
    }

    const booking = await Booking.create({
      userId,
      startTime,
      endTime,
      notes,
      status: 'pending',
    });

    return res.status(201).json(booking.dataValues);

  } catch (error) {
    handleError(res, error);
  }
};



const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      attributes: [
        'id',
        'userId',
        'startTime',
        'endTime',
        'status',
        'notes',
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'], 
        },
      ],
      order: [['createdAt', 'DESC']],
      raw: true,
    });

    const flattened = bookings.map(b => ({
      id: b.id,
      userId: b.userId,
      startTime: b.startTime,
      endTime: b.endTime,
      status: b.status,
      notes: b.notes,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      name: b['user.name'],
      email: b['user.email'],
    }));

    return res.status(200).json(flattened);
  } catch (error) {
    handleError(res, error);
  }
};


const getBookingsByUserId = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const bookings = await Booking.findAll({
      where: { id },
      attributes: [
        'id',
        'userId',
        'startTime',
        'endTime',
        'status',
        'notes',
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
      raw: true,
    });

    const flattened = bookings.map(b => ({
      id: b.id,
      userId: b.userId,
      startTime: b.startTime,
      endTime: b.endTime,
      status: b.status,
      notes: b.notes,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      name: b['user.name'],
      email: b['user.email'],
    }));

    return res.status(200).json({...flattened[0]});
  } catch (error) {
    handleError(res, error);
  }
};


const updateBookingStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const bookingId = id;

    const allowedStatuses = ['accepted', 'rejected'];

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required',
      });
    }

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either accepted or rejected',
      });
    }

    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    booking.status = status;
    await booking.save();

    return res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      data: booking,
    });

  } catch (error) {
    handleError(res, error);
  }
};




const deleteBooking = async (req, res) => {
  try {
    const id = req.params.id;

    const bookingId = id;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required',
      });
    }

    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    await booking.destroy();

    return res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
    });

  } catch (error) {
    handleError(res, error);
  }
};




const getBookingsByUserId2 = async (req, res) => {
  try {
    const id = req.params.id;

    const userId = id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const bookings = await Booking.findAll({
      where: { userId },
      attributes: [
        'id',
        'userId',
        'startTime',
        'endTime',
        'status',
        'notes',
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
      raw: true,
    });

    const flattened = bookings.map(b => ({
      id: b.id,
      userId: b.userId,
      startTime: b.startTime,
      endTime: b.endTime,
      status: b.status,
      notes: b.notes,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      name: b['user.name'],
      email: b['user.email'],
    }));

    return res.status(200).json(flattened);
  } catch (error) {
    handleError(res, error);
  }
};



module.exports = {
  updateBookingStatus, getBookingsByUserId, createBooking, getAllBookings, deleteBooking, getBookingsByUserId2
};
