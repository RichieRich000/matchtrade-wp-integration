app.post('/register', async (req, res) => {
  console.log('✅ Received request:', JSON.stringify(req.body, null, 2));

  const data = req.body;

  try {
    const response = await axios.post(
      'https://broker-api-wl.match-trade.com/v1/accounts',
      data,
      {
        headers: {
          'Authorization': '9_Qd-TWhdmywM76uEnoex33Lci3KD2gt0wX7wZcMSuM=',
          'Content-Type': 'application/json',
        },
      }
    );

    const token = response.data.oneTimeToken;

    res.json({
      success: true,
      redirectUrl: `https://client.b-investor.com/auth/one-time-token-login?token=${token}`,
    });

  } catch (error) {
    console.error('❌ Match-Trade API error:', error.response?.data || error.message);
    res.status(400).json({
      success: false,
      error: error.response?.data || 'Unexpected error',
    });
  }
});

