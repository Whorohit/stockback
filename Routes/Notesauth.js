const express = require('express')
const router = express.Router();
const fetchuser = require('../Middleware/Fetchuser')
const ledger = require("../models/userledger")
const mongoose = require('mongoose')

const { body, validationResult } = require('express-validator');

router.get('/api/data', fetchuser, async (req, res) => {
  try {
    const { month, year } = req.query;


    let startDate, endDate;

    if (month && year) {

      startDate = new Date(`${year}-${month}-01`).toISOString();
      const nextMonth = (parseInt(month, 10) % 12) + 1;
      const nextYear = (parseInt(month, 10) === 12) ? parseInt(year, 10) + 1 : parseInt(year, 10);
      endDate = new Date(nextYear, nextMonth - 1, 1).toISOString();
    } else if (year) {

      startDate = new Date(`${year}-01-01`).toISOString();
      endDate = new Date(`${parseInt(year, 10) + 1}-01-01`).toISOString();
    } else {

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed
      startDate = new Date(`${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`).toISOString();
      const nextMonth = (currentMonth % 12) + 1;
      const nextYear = (currentMonth === 12) ? currentYear + 1 : currentYear;
      endDate = new Date(nextYear, nextMonth - 1, 1).toISOString();
    }

    const notes = await ledger.find({
      user: req.user, date: {
        $gt: startDate,
        $lt: endDate,
      },
    }).sort({ date: -1 }); 
    // const notes = await ledger.find({ user: req.user, })

    res.json({ notes: notes, success: true })
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ errors: "Internal Server error", success: false });
  }

}
)
router.get('/api/graphdata', fetchuser, async (req, res) => {
  try {
    const { month, year } = req.query;

    let startDate, endDate;

    if (month && year) {
      // If both month and year are present, retrieve data for each date of the specified month in the specified year
      startDate = new Date(`${year}-${month}-01`).toISOString();
      const nextMonth = (parseInt(month, 10) % 12) + 1;
      const nextYear = (parseInt(month, 10) === 12) ? parseInt(year, 10) + 1 : parseInt(year, 10);
      endDate = new Date(nextYear, nextMonth - 1, 1).toISOString();
    } else if (year) {
      // If only year is present, retrieve data for each month of the specified year
      startDate = new Date(`${year}-01-01`).toISOString();
      endDate = new Date(`${parseInt(year, 10) + 1}-01-01`).toISOString();
    }
    else if(month && !year){
      const currentYear = new Date().getFullYear();
      startDate = new Date(`${currentYear}-${month}-01`).toISOString();
      const nextMonth = (parseInt(month, 10) % 12) + 1;
      const nextYear = (parseInt(month, 10) === 12) ? parseInt(currentYear, 10) + 1 : parseInt(currentYear, 10);
      endDate = new Date(nextYear, nextMonth - 1, 1).toISOString();
    } else {
      // If both month and year are absent, retrieve data for each date of the current month
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed
      startDate = new Date(`${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`).toISOString();
      const nextMonth = (currentMonth % 12) + 1;
      const nextYear = (currentMonth === 12) ? currentYear + 1 : currentYear;
      endDate = new Date(nextYear, nextMonth - 1, 1).toISOString();
    }
    console.log(startDate, endDate);
    const aggregationPipeline = [
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user),
          date: {
            $gt: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: month ? '%Y-%m-%d' : '%Y-%m',
              date: { $toDate: '$date' },
            },
          },
          totalProfit: {
            $sum: {
              $cond: [
                { $eq: ['$profit_loss', 'Profit'] },
                '$margin',
                0,
              ],
            },
          },
          totalLoss: {
            $sum: {
              $cond: [
                { $eq: ['$profit_loss', 'Loss'] },
                '$margin',
                0,
              ],
            },
          },
        },
        
      
      },
     
      {
        $sort: {
          '_id': 1, 

        },
      },
      {
        $project: {
          _id: 0,
          time: '$_id', 
          totalProfit: 1,
          totalLoss: 1,
        },
      },
      
    ];

    const result = await ledger.aggregate(aggregationPipeline);

    res.json({ result, success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ errors: "Internal Server error", success: false });
  }
});
router.get('/api/Carddata', fetchuser, async (req, res) => {
  try {
  const { month, year } = req.query;


  let startDate, endDate;

  if (month && year) {

    startDate = new Date(`${year}-${month}-01`).toISOString();
    const nextMonth = (parseInt(month, 10) % 12) + 1;
    const nextYear = (parseInt(month, 10) === 12) ? parseInt(year, 10) + 1 : parseInt(year, 10);
    endDate = new Date(nextYear, nextMonth - 1, 1).toISOString();
  } 
  else if (year) {

    startDate = new Date(`${year}-01-01`).toISOString();
    endDate = new Date(`${parseInt(year, 10) + 1}-01-01`).toISOString();
  }
  else if(month && !year){
    const currentYear = new Date().getFullYear();
    startDate = new Date(`${currentYear}-${month}-01`).toISOString();
    const nextMonth = (parseInt(month, 10) % 12) + 1;
    const nextYear = (parseInt(month, 10) === 12) ? parseInt(currentYear, 10) + 1 : parseInt(currentYear, 10);
    endDate = new Date(nextYear, nextMonth - 1, 1).toISOString();
  }
   else {

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed
    startDate = new Date(`${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`).toISOString();
    const nextMonth = (currentMonth % 12) + 1;
    const nextYear = (currentMonth === 12) ? currentYear + 1 : currentYear;
    endDate = new Date(nextYear, nextMonth - 1, 1).toISOString();
  }

  const pipeline = [
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user),
        date: {
          $gt: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $facet: {
        Profit_Loss: [
          {
            $group: {
              _id: '$profit_loss',
              count: { $sum: 1 },
            },
          },
        ],
        totals: [
          {
            $group: {
              _id: null,
              totalQuantity: { $sum: '$quantity' },
              totalPrice: { $sum: '$price' },
            },
          },
        ],
      },
    },
    {
      $sort: {
        '_id': 1, // Sort by date in ascending order
        // '_id': -1, // Sort by date in descending order
      },
    },
    {
      $project: {
        _id: {
          $concat: [
            { $substr: ['$date', 5, 2] },  // Extract month
            '-',
            { $substr: ['$date', 0, 4] }    // Extract year
          ]
        },
        Profit_Loss: '$Profit_Loss',
        totals: '$totals',
        totalQuantity: 1,
        totalPrice: 1,
      },
    },
  ];
  
  const results = await ledger.aggregate(pipeline);
  console.log(results);

  
  res.json({ results: results, success: true })
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ errors: "Internal Server error",success:false  });
  }

}
)
router.get('/api/specificdata/:share', fetchuser, async (req, res) => {
  try {

    const { user } = req;
    const data = { user };
    if (req.params.share) {
      data.share = req.params.share;


    }
    if (req.query.startDate && req.query.endDate) {
      data.date = {
        $gte: req.query.startDate,
        $lt: req.query.endDate,
      }

    }
    console.log(data);
    const notes = await ledger.find(data)
    // console.log(notes,"specificdata")
    res.json({ notes, success: true })
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ errors: "Internal Server error", success: false });
  }

}
)
const allowedActions = ['update', 'delete', 'update', 'update delete','delete update'];
router.post('/api/savedata', fetchuser, [
  body('share', 'title cannot be smaller than 2 characters').isLength({ min: 2 }),
  body('margin', 'enter the  correct amount').isLength({ min: 1 }),
  body('time', 'enter the vaild time').isLength({ min: 5 }),
  body('price', 'enter the vaild  price').isNumeric(),
  body('quantity', 'enter the vaild  quantity').isNumeric(),
  body('date', 'enter the vaild  date').isLength({ min:10 ,max:10 }),
  body('action').isIn(allowedActions).withMessage('Invalid action. Choose from: no update, delete, update, update delete')

], async (req, res) => {
  try {
    const { profit_loss, share, time, price, margin, action,quantity, date } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      return res.status(400).json({ errors: errorMessages, success: false });

    }
    const createnote = new ledger({ profit_loss, share, time, price, margin, action, quantity, user: req.user, date })
    const savedata = await createnote.save();

    res.json({ savedata, success: true,message:"Added successfully"})
  } catch (error) {
    res.status(500).send({ errors: "Internal Server error", success: false })
  }
})
router.post('/api/updatenote/:id', fetchuser,
  [
    body('share', 'title cannot be smaller than 2 characters').isLength({ min: 2 }),
    body('margin', 'enter the  correct amount').isLength({ min: 1 }),
    body('time', 'enter the vaild time').isLength({ min: 5 }),
    body('price', 'enter the vaild  price').isLength({ min: 1 }),
    body('action', 'action is empty  so cannot perform any opertion').isEmpty(),
  ], async (req, res) => {
    const { share, time, profit_loss, price, margin, action, quantity, date } = req.body

    try {
      let success = false
      let newnote = {}
      if (share) { newnote.share = share }
      if (time) { newnote.time = time }
      if (quantity) { newnote.quantity = quantity }
      if (profit_loss) { newnote.profit_loss = profit_loss }
      if (price) { newnote.price = price }
      if (margin) { newnote.margin = margin }
      if (date) { newnote.date = date }
      if (action) { newnote.action = action }
      let data = await ledger.findById(req.params.id)
      if (!data) {
        return res.status(401).send({ success: false, errors: "Ledger is not exists" })
      }
      if (!data.action.includes('update')) {
        return res.status(400).json({ success: false, errors: "does not include  updation permission" });
      }
      if (data.user.toString() != req.user) {
        return res.status(401).send({ success: false, errors: "Failed to delete " })

      }
      const n = await ledger.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true })
      res.json({ message: "Update successfully ", success: true })
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ errors: "Internal Server error", success: false })

    }
  })
router.get('/api/deletenote/:id', fetchuser, async (req, res) => {
  let success = false
  try {
    const data = await ledger.findById(req.params.id)
    if (!data) {
      return res.status(401).send("Doesn't exists ")
    }
    if (!data.action.includes('delete')) {
      return res.status(400).json({ success:false, errors: "does not include  deletion permission" });
    }

    if (data.user.toString() !== req.user) {
      return res.status(401).send("Failed")
    }
    const n = await ledger.findByIdAndDelete(req.params.id)
    res.json({message:"Ledger has been delete successfully ", note: n, success:true })

  } catch (error) {
    res.status(500).send({ errors: "Internal Server error", success: false })
  }
})


module.exports = router