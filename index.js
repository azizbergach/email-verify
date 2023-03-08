const express = require('express');
const Verifier = require('email-verifier');
require('dotenv').config();

const app = express();

app.use(express.json());

app.post('/verify-email', async (req, res) => {
    const { email } = req.body;

    if (!email) return res.json({
        error: 'no email was provided'
    })

    let verifier = new Verifier(process.env.API_KEY);

    verifier.verify(email, (err, data) => {

        if (err) {
            return res.json({ success: false, valid: "check again", error: err.message });
        }

        if (data.formatCheck && data.dnsCheck && data.smtpCheck) {
            return res.json({ success: true, valid: true, emailAddress: data.emailAddress, updatedAt: data.audit.auditUpdatedDate });
        } else {
            return res.json({ success: true, valid: false, emailAddress: data.emailAddress, updatedAt: data.audit.auditUpdatedDate });
        }
    });

});

app.listen(3000, () => {
    console.log('Email verification API listening on port 3000!');
});
