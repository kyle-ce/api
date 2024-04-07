const axios = require("axios");
const xml2js = require("xml2js");

// Define the SOAP request payload
const soapRequest = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://example.com/webservice">
   <soapenv:Header/>
   <soapenv:Body>
      <web:MyFunction>
         <arg1>5</arg1>
         <arg2>10</arg2>
      </web:MyFunction>
   </soapenv:Body>
</soapenv:Envelope>
`;

// Define the URL of your SOAP endpoint
const SOAP_URL = "http://localhost:8000/soap";
const REST_URL = "http://localhost:8001/rest";

// Send the SOAP request using axios
axios
  .post(SOAP_URL, soapRequest, {
    headers: {
      "Content-Type": "text/xml",
    },
  })
  .then((response) => {
    // Parse the XML response to JavaScript object
    xml2js.parseString(response.data, (err, result) => {
      if (err) {
        console.error("Error parsing SOAP response:", err);
      } else {
        // Handle the SOAP response
        console.log(
          "SOAP Response:",
          result["soap:Envelope"]["soap:Body"][0]["tns:MyFunctionResponse"]
        );
      }
    });
  })
  .catch((error) => {
    console.error("Error sending SOAP request:", error);
  });
axios.get(REST_URL).then(({ data }) => console.log("REST Response:", data));
