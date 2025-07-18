const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Match-Trade API config
const MATCHTRADE_URL = 'https://broker-api-wl.match-trade.com/v1/accounts';
const OFFER_UUID = '1a3d47dd-ea8c-4529-9e36-8a42499fcc69';
const API_TOKEN = '9_Qd-TWhdmywM76uEnoex33Lci3KD2gt0wX7wZcMSuM=';

function generatePassword() {
  return Math.random().toString(36).slice(-10);
}

app.post('/register', async (req, res) => {
  try {
    const data = req.body;
    const password = generatePassword();

    const payload = {
      email: data.email,
      password,
      offerUuid: OFFER_UUID,
      personalDetails: {
        firstname: data.firstName,
        lastname: data.lastName,
        dateOfBirth: "1990-01-01",
        citizenship: "US",
        language: "EN",
        maritalStatus: "SINGLE",
        passport: {
          number: "000000000",
          country: "US"
        },
        taxIdentificationNumber: "000000000"
      },
      contactDetails: {
        phoneNumber: data.phoneNumber,
        toContact: {
          alreadyContacted: false
        }
      },
      accountConfiguration: {
        partnerId: 100,
        accountTypeContact: false
      },
      leadDetails: {
        source: "starmind.info"
      }
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`
    };

    const response = await axios.post(MATCHTRADE_URL, payload, { headers });

    const oneTimeToken = response.data.oneTimeToken;
    const loginLink = `https://client.b-investor.com/auth/one-time-token-login?token=${oneTimeToken}`;

    res.status(200).json({
      success: true,
      message: 'User created.',
      redirectUrl: loginLink
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
