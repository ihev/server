  const HTTP_PORT = process.env.HTTP_PORT || 8080;
  const HTTPS_PORT = process.env.HTTPS_PORT || 8443;
  const WS_PORT = process.env.WS_PORT || 8081;
  const KEY_PATH = process.env.KEY_PATH || 'key.pem';
  const CERT_PATH = process.env.CERT_PATH || 'cert.pem';


  // Initialize the HTTP server independently
  const initHttp = async () => {
    const http = await import('http');
    const server = http.createServer(httpRequestHandler)
    server.listen(HTTP_PORT, () => console.log(`HTTP server running on http://localhost:${HTTP_PORT}`));
  };

  // Initialize the HTTPS server independently
  const initHttps = async () => {
    const https = await import('https');
    const { readFileSync } = await import('fs');
    try {
      const options = {
        key: readFileSync(KEY_PATH),
        cert: readFileSync(CERT_PATH)
      }
      const server = https.createServer(options, httpsRequestHandler);
      server.listen(HTTPS_PORT, () => console.log(`HTTPS server running on https://localhost:${HTTPS_PORT}`));
    } catch {
      console.error(`Could not start HTTPS server. Make sure ${KEY_PATH} and ${CERT_PATH} files are present in the root directory.`)
    } 
  };

  // Initialize the WebSocket server independently
  const initWebSocket = async () => {
    const ws = await import('ws');
    const server = new ws.WebSocketServer({ port: WS_PORT });
    server.on('connection', socket => {
      socket.on('message', message => wsMessageHandler(message, socket));
      socket.send('Welcome to WebSocket server!');
    });
  };

  // HTTP request listener
  const httpRequestHandler = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end("'Hello from HTTP\n'");
  }

  // HTTPS request listener
  const httpsRequestHandler = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello from HTTPS\n');
  }

  // WebSocket message listener
  const wsMessageHandler = (message, socket) => {
    console.log('Received message:', message);
    socket.send('Message received: ' + message);
  }

  // Start all servers
  initHttp();
  initHttps();
  initWebSocket();

