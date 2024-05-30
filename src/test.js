const https = require('https');

const url = "https://api.jina.ai/v1/embeddings";
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer'
  }
};

const data = {
  input: ["Your text string goes here", "You can send multiple texts"],
  model: 'jina-embeddings-v2-base-en',
  encoding_type: 'float'
};

const req = https.request(url, options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const parsedData = JSON.parse(data);
    console.log(parsedData);
  });
});

req.write(JSON.stringify(data));
req.end();