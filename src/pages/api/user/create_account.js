import express from "express";
import connectDB from "../mongodb";
import UserAccountRegistration from "../../../models/user/create_user_account";
// import multer from "multer";
import bcrypt from "bcrypt";
import fs from "fs";
import { google } from "googleapis";

const app = express();
// app.use(express.json());

connectDB();

export default async function handler(req, res) {
  try {
    await handleUserRegistration(req, res);
  } catch (error) {
    console.error("Unhandled error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handleUserRegistration(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const {
      fullName,
      email,
      phoneNumber,
      homeAddress,
      category,
      institution,
      yearOfGraduation,
      guardianName,
      guardianPhoneNumber,
      medicalCondition,
      healthCondition,
      proofOfPayment,
      password,
    } = req.body;

    // console.log("Proof of payment log in the api", proofOfPayment);
    // console.log(email);

    if (!fullName || !email || !phoneNumber || !category || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserAccountRegistration.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "This email has been registered, try another one",
      });
    }

    let requiredFields = [
      "fullName",
      "email",
      "phoneNumber",
      "homeAddress",
      "category",
      "password",
    ];

    if (category === "student") {
      requiredFields.push("institution");
    } else if (category === "iotb") {
      requiredFields.push("institution", "yearOfGraduation");
    } else if (category === "children") {
      requiredFields.push("guardianName", "guardianPhoneNumber");
    } else if (category === "nonTimsanite") {
      requiredFields.push("healthCondition");
    }

    let additionalFieldsRequired = false;

    if (category === "student" && !institution) {
      additionalFieldsRequired = true;
    } else if (category === "iotb" && (!institution || !yearOfGraduation)) {
      additionalFieldsRequired = true;
    } else if (
      category === "children" &&
      (!guardianName || !guardianPhoneNumber)
    ) {
      additionalFieldsRequired = true;
    } else if (category === "nonTimsanite" && !healthCondition) {
      additionalFieldsRequired = true;
    }

    if (additionalFieldsRequired) {
      return res.status(400).json({
        message:
          "Additional fields are required based on the selected category",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const categoryID = getCategoryID(category);
    const participantID = generateParticipantID();

    const lastUser = await UserAccountRegistration.findOne(
      {},
      {},
      { sort: { uniqueID: -1 } }
    );

    let counter = 1;
    if (lastUser && lastUser.uniqueID) {
      const parts = lastUser.uniqueID.split("-");
      if (parts.length === 3) {
        const lastCounter = parseInt(parts[2]);
        if (!isNaN(lastCounter)) {
          counter = lastCounter + 1;
        }
      }
    }

    const uniqueID = await generateUniqueID(category);
    const timestamp = new Date();

    const userData = new UserAccountRegistration({
      fullName,
      email,
      phoneNumber,
      homeAddress,
      category,
      institution: institution || "",
      yearOfGraduation: yearOfGraduation || "",
      guardianName: guardianName || "",
      guardianPhoneNumber: guardianPhoneNumber || "",
      medicalCondition: medicalCondition || "",
      healthCondition: healthCondition || "",
      proofOfPayment,
      password: hashedPassword,
      uniqueID,
      timestamp,
    });

    // console.log(
    //   "This is the user data details that is about to be saved for the registering user:",
    //   userData
    // );

    await userData.save();

    await appendToSheet(userData);

    res.status(201).json({
      message: "Registration successful",
      fullName,
      email,
      phoneNumber,
      category,
      proofOfPayment,
      uniqueID,
      timestamp,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Define the service account credentials
const credentials = {
  type: "service_account",
  project_id: "toycac24-419900",
  private_key_id: "b38cc9c45f42f7d6aa654f24eca5cd8360ce385f",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDJJwMBTuk7eEsp\npadiFMcbXbN3MZUIRAk7XahgZQ9zfvIoMLDIqOu3THDaB1yLWWZ1nlrbjtyMjCiY\nPVVnR08tAWYTwB++ms8a2bKIUwh9TWyEoHpZS5fUZoe4WaoTumD0vfwtaUAPSR/d\nwsjJpjDOnx/uDXuouCVmHde80hLi0bu9Xd2Qoj+e9Z7Viez845WzV7seR48WxBmJ\n0CFLWhHrIKli+jee1LVO9xPv/Wbv0FAQvMeUOLt0Uvsyymeos0d5hv6KL9utpnpY\nXyWu4lbJsbzC0GfusAwgNm6YLmxi2R4RXf2enDXs/Kngk4PMfNVHQUvz68eFC0Tw\nHg/+EQ6JAgMBAAECggEAOaNnFgnhhPvsNavU8aLYhrvrv9zCQpMUPiGRLMXojoSy\nqNeC4IyetnA96guv9fIRDOTqTf16rv8+Zpk0jpp9Un0THdewgPJlI+F7adq5FQaJ\ncNt3E304rVEP1MBEntCKFbcWuoBtLbQbYHT/CeEIHTy1boYIiAj0FnW4qs9bQAis\n+rYsOJtsGL0+M86j+Xjyyy+AFOIwEbzEWtluC/6QQbQjoAuJVEl5ojlvPVJg+qPv\nA8M/co1fH+jKLnDtaIQPD+4KqZRtxZi0caN002IsDn3yTZXfM7FqvSXpRdtCnuUX\nQUVjsOeUNATUxMmmSMoS5bKXdg1psKP+6586BUZ2bQKBgQDnnARQGrX0XyY9owcF\nsyND/K/D+ReMqXw2docJouVhWZ7npq8X9xAHv5wigcn4Oz3QWdmK3Sd7g+EQ7Fr8\nG1ZM5gGg+Gxm8xDbDZmH4cQekWQ6uxtW5OFYKoCZrCpxfMyRdR9/hcAhV5n46hDS\n26K4U5+s/7Qz/rmQv1MwpbADIwKBgQDeVeZqX82Asvh+zk2FxmtRiNILZcYBeUCN\nNgX+81tREiKnWsefM3lm2oXE8CmO//kyAEe0N9cO33lX7gdTii42WpPgMuG99gA9\nT/sW4pNClcPynJGuHXFs3CQVZ9f3+q21KU1FO6VAAfrDC2OwwfPCdsRTko6wmf6p\nhZHFlkpIYwKBgE7LbUwzSiPRGxltFT6DK0Q9+y4Y2EIqhu+gc2B74r2z17PHqVnl\n27ZHIb87mJKy1NzFNJVhl8UVoMQ5JNsQEdQni/ZPjdGYb+uWPN1VmXssy4SPk0WE\nqIVuMEIXqHjjlFUIG6cuwaaWPvPH7eFOh5VeHbylYZEu38K21H6AX9kxAoGBANlB\nxy4a/4zLVddTcJ1QDn5V3CoXAS1fdpyGNcWzt3+44PP32SjP+8ltr1mJ9JIvvyoE\n7AxGpHd8F+68QZx4Yj/qsqVaEwy03fcLuKfcL1nZTug75n7ldniRhREFsBw5cJSe\nD0ufxRKO3KLK9lc6rx9PPvkLNTOMxzSPuKoC+gNRAoGAfw5n8V/Tplu1d5OpGuG5\n8g79vReqpBDgYwCi/WqIZkMxoiV+LFqu5tRa49uJjcbVhSONmTsX3RHRItxHvO1h\nHHwemB9PcgGngUgCy1UN/XqP2NzUYuNpExxcllX3wdSUIMTWWGKEYxvoZnve4ty+\nkjEj2uyloA+knsPIuR7vEKE=\n-----END PRIVATE KEY-----\n",
  client_email: "toycac@toycac24-419900.iam.gserviceaccount.com",
  client_id: "102162798731964732623",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/toycac%40toycac24-419900.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

// Function to append data to the Google Sheet
async function appendToSheet(userData) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    // Create a new instance of Google Sheets API
    const sheets = google.sheets({ version: "v4", auth });
    // Prepare the data to append
    const request = {
      spreadsheetId: "1Ezna-5Jcaf9Cp24xdvAxcA-Nw18N2qsa0EGE0QiATxs",
      range: "Sheet1",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: [
          [
            userData.fullName,
            userData.email,
            userData.phoneNumber,
            userData.category,
            userData.uniqueID,
            userData.proofOfPayment,
            userData.timestamp,
          ],
        ],
      },
    };
    // Append data to the Google Sheet
    const response = await sheets.spreadsheets.values.append(request);
    console.log("Data appended successfully:", response.data);
  } catch (error) {
    console.error("Error appending data to Google Sheet:", error);
  }
}

// Function to generate category ID
function getCategoryID(category) {
  switch (category.toLowerCase()) {
    case "student":
      return "STD";
    case "iotb":
      return "IOTB";
    case "children":
      return "CHD";
    case "non-timsanite":
      return "NTMS";
    default:
      return "";
  }
}

// Define the initial house abbreviation index
let houseAbbreviationIndex = 0;

// Define the initial participant ID counter
let participantIDCounter = 1;

// // Function to generate participant ID based on cyclic pattern
function generateParticipantID() {
  const houseAbbreviations = ["UMR", "UTH", "ALI", "ABU"];
  const participantIDs = {
    UMR: 0,
    UTH: 0,
    ALI: 0,
    ABU: 0,
  };

  // Increment the house abbreviation index
  houseAbbreviationIndex = (houseAbbreviationIndex + 1) % 4;

  const currentAbbreviation = houseAbbreviations[houseAbbreviationIndex];

  // Increment the participant ID counter only when the cycle is complete
  if (houseAbbreviationIndex === 0) {
    participantIDCounter++;
  }

  const paddedCounter = (
    participantIDs[currentAbbreviation] + participantIDCounter
  )
    .toString()
    .padStart(3, "0");

  return `${currentAbbreviation}${paddedCounter}`;
}

// Function to generate unique ID
async function generateUniqueID(category) {
  const categoryID = getCategoryID(category);
  let participantID = generateParticipantID();
  let uniqueID = `TOYCAC24-${categoryID}-${participantID}`;

  // Check the database for existing uniqueIDs
  const existingIDs = await UserAccountRegistration.find({
    category: categoryID,
  }).distinct("uniqueID");

  // Check if the existingIDs array is not empty
  if (existingIDs.length > 0) {
    // Get the last uniqueID
    const lastUniqueID = existingIDs[existingIDs.length - 1];
    // Extract the participant ID from the last uniqueID
    const lastParticipantID = lastUniqueID.split("-").pop();
    // Increment the participant ID based on the cyclic pattern
    const nextParticipantID = (parseInt(lastParticipantID) + 1)
      .toString()
      .padStart(3, "0");
    // Update the participant ID
    participantID = nextParticipantID;
  }

  // Generate a new uniqueID until it's not in the existingIDs array
  while (existingIDs.includes(uniqueID)) {
    participantID = generateParticipantID();
    uniqueID = `TOYCAC24-${categoryID}-${participantID}`;
  }

  return uniqueID;
}

// Generate first 20 unique IDs for category "student"
// const firstTwentyUniqueIDs = [];
// for (let i = 0; i < 20; i++) {
//   const uniqueID = await generateUniqueID("student");
//   firstTwentyUniqueIDs.push(uniqueID);
// }

// console.log(firstTwentyUniqueIDs);
