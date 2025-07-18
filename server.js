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

// Generates random password
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
        dateOfBirth: data.dateOfBirth || "1990-01-01",
        citizenship: data.citizenship || "US",
        language: "EN",
        maritalStatus: "SINGLE",
        passport: {
          number: data.passportNumber || "000000000",
          country: data.passportCountry || "US"
        },
        taxIdentificationNumber: data.tin || "000000000"
      },
      contactDetails: {
        phoneNumber: data.phoneNumber,
        faxNumber: "",
        toContact: {
          toContactDate: "",
          alreadyContacted: false
        }
      },
      accountConfiguration: {
        partnerId: 100,
        branchUuid: "f69669de-6d0f-4861-abd1-d5a623b7015b",
        roleUuid: "8f6705d1-fef5-4121-89e7-55483bc8db6a",
        accountManagerUuid: "",
        ibParentTradingAccountUuid: "",
        crmUserScope: {
          branchScope: [""],
          managerPools: [""]
        },
        accountTypeContact: false
      },
      addressDetails: {
        country: data.country || "US",
        state: data.state || "",
        city: data.city || "",
        postCode: data.postCode || "",
        address: data.address || ""
      },
      bankingDetails: {
        bankAddress: "",
        bankSwiftCode: "",
        bankAccount: "",
        bankName: "",
        accountName: ""
      },
      leadDetails: {
        statusUuid: "69b10a39-6df2-4f4f-8b5e-b72971c6f2d0",
        source: "starmind.info",
        providerUuid: "e98e09e6-0555-49dd-b73b-cb8704231333",
        becomeActiveClientTime: ""
      }
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`
    };

    const response = await axios.post(MATCHTRADE_URL, payload, { headers });

    // Get login link from API response
    const oneTimeToken = response.data.oneTimeToken;
    const loginLink = `https://client.b-investor.com/auth/one-time-token-login?token=${oneTimeToken}`;

    // Send response
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
