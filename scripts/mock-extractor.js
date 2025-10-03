const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/extract-claims') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      // Mock response
      const response = {
        claims: [
          { text: "Drug X reduces blood pressure by 20%", page: 1 },
          { text: "Patients experienced fewer side effects with Drug X", page: 2 },
          { text: "Clinical trial showed 85% efficacy rate", page: 3 }
        ]
      };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(8000, () => {
  console.log('Mock extractor service running on http://localhost:8000');
});