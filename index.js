const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

BASE_PATH = 'http://localhost:8080'; // Replace with your actual base path


const encrypt = async (message) => {
    const encryptedBody = await fetch(`${BASE_PATH}/encrypt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    });
    return await encryptedBody.text();
};

const decrypt = async (message) => {
    const decryptedMessage = await fetch(`${BASE_PATH}/decrypt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message
        })
    });
    return await decryptedMessage.text();
};


const processMessage = async (message) => {
    const processMessage = await fetch(`${BASE_PATH}/index`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: message
    });
    return await processMessage.text();
}

// POST endpoint at /hello
app.post('/hello', async (req, res) => {
    const encryptedBodyText = await encrypt(req.body);
    console.log("processMessage.......................");
    const processedMessage = await processMessage(encryptedBodyText);
    console.log("processedMessage.......................");
    const decrypteBody = await decrypt(processedMessage);
    console.log("decrypteBody.......................");
    const decryptedJson  = JSON.parse(decrypteBody);
    res.json(decryptedJson);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});