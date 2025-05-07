const express = require("express");
const router = express.Router();
const axios = require("axios");
const { parseStringPromise } = require("xml2js");

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

router.post("/submit", async (req, res) => {
  const payload = req.body;

  console.log("🔐 Using API Key:", API_KEY);
  console.log("📤 Sending payload to Accident.com API:");
  console.log(JSON.stringify(payload, null, 2));

  const headers = {
    "api-key": API_KEY,
    "api-secret": API_SECRET,
    "Content-Type": "application/json"
  };

  console.log("🧾 Request Headers:", headers);

  try {
    const response = await axios.post("https://api.accident.com/api/lead-create", payload, {
      headers
    });

    const parsedXml = await parseStringPromise(response.data);

    console.log("✅ API Response Received:");
    console.log(JSON.stringify(parsedXml, null, 2));

    res.status(200).json({
      message: "Lead submitted",
      apiResponse: parsedXml
    });

  } catch (err) {
    console.error("❌ Error submitting lead:");
    const apiError = err.response ? err.response.data : err.message;

    let parsedError = apiError;
    if (typeof apiError === "string" && apiError.startsWith("<")) {
      try {
        parsedError = await parseStringPromise(apiError);
      } catch (parseErr) {
        console.error("XML Parse Error:", parseErr);
      }
    }

    res.status(500).json({
      message: "Error submitting lead",
      apiError: parsedError
    });
  }
});

module.exports = router;
