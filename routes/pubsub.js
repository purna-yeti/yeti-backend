const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    if (!req.body) {
      const msg = 'no Pub/Sub message received';
      console.error(`error: ${msg}`);
      res.status(400).send(`Bad Request: ${msg}`);
      return;
    }
    if (!req.body.message) {
      const msg = 'invalid Pub/Sub message format';
      console.error(`error: ${msg}`);
      res.status(400).send(`Bad Request: ${msg}`);
      return;
    }
  
    const pubSubMessage = req.body.message;
    const name = pubSubMessage.data
      ? Buffer.from(pubSubMessage.data, 'base64').toString().trim()
      : 'World';
  
    console.log(`Hello ${name}!`);
    res.status(204).send();
  });

module.exports = router; 
