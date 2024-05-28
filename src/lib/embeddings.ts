import * as https from 'https';

export async function getEmbeddings(text: string): Promise<number[]> {
  const url = "https://api.jina.ai/v1/embeddings";
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer jina_f0864e2a766f46f0a4d1ad677c5ecb28D5sMaXJbBhFII3yko3Sunc3kE2Ru',
    }
  };

  const data = {
    input: [text.replace(/\n/g, ' ')],
    model: 'jina-embeddings-v2-base-en',
    encoding_type: 'float'
  };

  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let chunks: Buffer[] = [];

      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const body = Buffer.concat(chunks).toString();
        const result = JSON.parse(body);

        console.log('Response status:', res.statusCode); // Log the response status
        console.log('API result:', result); // Log the API result

        if (!result.data || result.data.length === 0) {
          reject(new Error('No data returned from Jina AI API'));
        } else {
          resolve(result.data[0].embedding as number[]);
        }
      });
    });

    req.on('error', (error) => {
      console.log("error calling Jina AI embeddings api", error);
      reject(error);
    });

    req.write(JSON.stringify(data));
    req.end();
  });
}