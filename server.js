// server.js

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Endpoint
app.post('/register', async (req, res) => {
  console.log('📨 Incoming data:', req.body);

  try {
    // Send data to Match-Trade API
    const mtResponse = await axios.post(
      'https://broker-api-wl.match-trade.com/v1/accounts',
      req.body,
      {
        headers: {
          'Authorization': '9_Qd-TWhdmywM76uEnoex33Lci3KD2gt0wX7wZcMSuM=',
          'Content-Type': 'application/json',
        },
      }
    );

    const token = mtResponse.data.oneTimeToken;
    const redirectUrl = `https://client.b-investor.com/auth/one-time-token-login?token=${token}`;

    console.log('✅ Account created. Redirect:', redirectUrl);

    res.status(200).json({
      success: true,
      message: 'User created.',
      redirectUrl,
    });

  } catch (error) {
    console.error('❌ Match-Trade Error:', error.response?.data || error.message);

    res.status(400).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
