
const { default: mongoose } = require("mongoose");
const ledger = require("../models/userledger")
module.exports= async function insertRandomData() {
    function randomDate(start, end) {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
  
    // Get the current date
    const currentDate = new Date('2024-03-22');
  
    // Generate and insert 1000 documents up to the current date of 2023
    const documents = [];
  
    for (let i = 0; i < 1000; i++) {
      const randomDateValue = randomDate(new Date('2024-01-01'), currentDate);
      const randomTimeValue = `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
      const uniqueShareName = `share_${i.toString().padStart(5, '0')}`;
      const document = {
        user:  new mongoose.Types.ObjectId('64ff29fc31db382be450e291'), // Replace with the actual user ID
        profit_loss: i % 2 === 0 ? 'Profit' : 'Loss', // Alternating between Profit and Loss
        date: randomDateValue.toISOString().split('T')[0],
        share: uniqueShareName,
        time: randomTimeValue,
        price: Math.floor(Math.random() * 2000) + 1, // Random price between 1 and 2000
        margin: Math.floor(Math.random() * 100) + 1, // Random margin between 1 and 100
        quantity: Math.floor(Math.random() * 500) + 1, // Random quantity between 1 and 500
        action: '11', // Replace with the actual action value
      };
  
      documents.push(document);
    }
  
    // Insert the documents into the database
    ledger.insertMany(documents)
      .then((result) => {
        console.log(`${result.length} documents inserted successfully.`);
      })
      .catch((error) => {
        console.error('Error inserting documents:', error);
      })
      .finally(() => {
        // Close the database connection
        mongoose.disconnect();
      });
  
  }

  