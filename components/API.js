import React, { useState } from "react";
import { Text, View } from "react-native";
import { GEMINI_API_KEY } from "@env";

// ✅ Parse Gemini response text into JSON
const parseReceiptText = (text) => {
  const lines = text.split("\n").map((line) => line.trim());
  const title = lines.find((line) => line.toLowerCase().startsWith("title:"))?.split(":")[1]?.trim();
  const amountRaw = lines.find((line) => line.toLowerCase().startsWith("amount:"))?.split(":")[1]?.trim();
  const type = lines.find((line) => line.toLowerCase().startsWith("type:"))?.split(":")[1]?.trim()?.toLowerCase();
  const amount = amountRaw?.replace(/[^0-9.]/g, ""); // removes $, etc.

  return { title, amount, type };
};

// ✅ Gemini API: Extract receipt info from image
export const extractReceiptDataAPI = async (base64Image) => {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Extract and return ONLY the following fields from the receipt:
                    - Title
                    - Amount
                    - Type (income or expense)
                    Format it exactly like this:
                    Title: [value]
                    Amount: $[value]
                    Type: [income or expense]`,
              },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Image,
                },
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  console.log("Gemini raw response:\n", text);

  const structuredData = parseReceiptText(text);

  structuredData.timestamp = new Date().toISOString();


  return structuredData;
};

// ✅ UI Component for displaying extracted data
const AIAPIReceipt = () => {
  const [receiptData, setReceiptData] = useState(null);

  const processReceipt = async (base64Image) => {
    const result = await extractReceiptDataAPI(base64Image);
    setReceiptData(result);
  };

  if (receiptData) {
  console.log("Title:", receiptData.title);
  console.log("Amount:", receiptData.amount);
  console.log("Type:", receiptData.type);
}

  
};

export default AIAPIReceipt;
