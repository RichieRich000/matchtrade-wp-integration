const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

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
        partnerId: null,
        branchUuid: "",
        roleUuid: "",
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
        statusUuid: "",
        source: "Starmind.info",
        providerUuid: "",
        becomeActiveClientTime: ""
      }
    };

    const headers = {
      'Content-Type': 'application/json',
      'api-token': API_TOKEN
    };

    const response = await axios.post(MATCHTRADE_URL, payload, { headers });

    // Send login email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'YOUR_GMAIL@gmail.com',
        pass: 'YOUR_APP_PASSWORD'
      }
    });

    await transporter.sendMail({
      from: 'YOUR_GMAIL@gmail.com',
      to: data.email,
      subject: 'Your Trading Account Has Been Created',
      text: `Welcome ${data.firstName},\n\nYour account has been created.\nLogin: https://client.b-investor.com\nEmail: ${data.email}\nPassword: ${password}\n\nPlease login to access your account.`
    });

    res.status(200).json({ success: true, message: 'User created and email sent.' });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
