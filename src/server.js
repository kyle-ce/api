const soap = require("soap");
const http = require("http");
const fs = require("fs");
const express = require("express");

const SOAP_PORT = 8000;
const REST_PORT = 8001;
const WSDL_PATH = "myservice.wsdl";

const myFunction = (args) => {
  const { arg1, arg2 } = args;
  return { result: arg1 * arg2 };
};

// REST
const startREST = () => {
  const app = express();
  app.use(express.json());
  app.post("/rest", (req, res) => {
    const args = req.body;
    try {
      res.json({ result: myFunction(args).result });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" });
    }
  });
  app.listen(REST_PORT, () => {
    console.log(`Server is running on http://localhost:${REST_PORT}/rest`);
  });
};

//SOAP
const startSOAP = () => {
  const service = {
    MyService: {
      MyPort: {
        MyFunction: (args) => {
          try {
            return myFunction(args);
          } catch (error) {
            // Handle error
            const fault = {
              Fault: {
                faultcode: "Server",
                faultstring: "Internal Server Error",
                detail: {
                  errorMessage: error.message,
                },
              },
            };
            throw fault;
          }
        },
      },
    },
  };
  const xml = fs.readFileSync(WSDL_PATH, "utf8");
  const server = http.createServer((request, response) => {
    // Default server response before binding SOAP server below
    response.statusCode = 404;
    response.end("404: Not Found: " + request.url);
  });
  server.listen(SOAP_PORT, () =>
    console.log(`Server is running on http://localhost:${SOAP_PORT}/soap`)
  );
  soap.listen(server, "/soap", service, xml, (err) => {
    if (err) console.error("SOAP server errror:", err);
  });
};

startREST();
startSOAP();
