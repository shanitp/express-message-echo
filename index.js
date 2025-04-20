const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

BASE_PATH = 'http://ec2-18-116-51-254.us-east-2.compute.amazonaws.com:8080'; // Replace with your actual base path
KEY = '00 E4 35 FF 01 35 78 91 AB CD 00 E4 67 F0 12 CF';

const encrypt = async (message, key) => {
    const encryptedBody = await fetch(`${BASE_PATH}/encrypt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-encrypt-key': key
        },
        body: JSON.stringify(message)
    });
    return await encryptedBody.text();
};

const decrypt = async (message, key) => {
    const decryptedMessage = await fetch(`${BASE_PATH}/decrypt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-encrypt-key': key
        },
        body: JSON.stringify({
            message
        })
    });
    return await decryptedMessage.text();
};

const processMessage = async (message, key) => {
    const processMessage = await fetch(`${BASE_PATH}/index`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-encrypt-key': key
        },
        body: message
    });
    return await processMessage.text();
}

// POST endpoint at /hello
app.post('/hello', async (req, res) => {
    const encryptKey = req.headers['x-encrypt-key']; // Use provided key or fallback to default KEY
    const encryptedBodyText = await encrypt(req.body, encryptKey);
    const processedMessage = await processMessage(encryptedBodyText, encryptKey);
    const decrypteBody = await decrypt(processedMessage, encryptKey);
    const decryptedJson = JSON.parse(decrypteBody);
    res.json(decryptedJson);
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});