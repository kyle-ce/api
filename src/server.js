const soap = require("soap");
const http = require("http");
const fs = require("fs");
const express = require("express");

const SOAP_PORT = 8000;
const REST_PORT = 8001;
const WSDL_PATH = "myservice.wsdl";

const app = express();
// Define a route for handling GET requests
app.get("/rest", (req, res) => {
  // Handle the GET request
  res.json({ message: "This is a REST API response" });
});

const service = {
  MyService: {
    MyPort: {
      MyFunction: (args) => ({
        result: args.arg1 * args.arg2,
      }),
    },
  },
};

const xml = fs.readFileSync(WSDL_PATH, "utf8");

const server = http.createServer((request, response) => {
  response.statusCode = 404;
  response.end("404: Not Found: " + request.url);
});

server.listen(SOAP_PORT, () =>
  console.log(`Server is running on http://localhost:${SOAP_PORT}/soap`)
);
app.listen(REST_PORT, () => {
  console.log(`Server is running on http://localhost:${REST_PORT}`);
});
soap.listen(server, "/soap", service, xml);
