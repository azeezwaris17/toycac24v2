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
      NTMBIO,
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
      requiredFields.push("NTMBIO");
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
    } else if (category === "nonTimsanite" && !NTMBIO) {
      additionalFieldsRequired = true;
    }

    if (additionalFieldsRequired) {
      return res.status(400).json({
        message:
          "Additional fields are required based on the selected category",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const uniqueID = await generateUniqueID(category);
    const registrationTimestamp = new Date();
    // console.log("Ths is the registration timestamp:", registrationTimestamp);

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
      NTMBIO: NTMBIO || "",
      proofOfPayment,
      password: hashedPassword,
      registrationTimestamp,
      uniqueID,
    });

    // userData.registrationTimestamp = timestamp; // Add timestamp manually

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
      registrationTimestamp,
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
            userData.uniqueID,
            userData.approved,
            userData.proofOfPayment,
            userData.category,
            userData.registrationTimestamp,
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
let participantIDCounter = 1;

// Define an array to store used participant IDs
let usedParticipantIDs = [];

// Function to generate participant ID
function generateParticipantID(abbreviation) {
  const currentAbbreviation = abbreviation || "ABU";
  const paddedCounter = participantIDCounter.toString().padStart(3, "0");
  const participantID = `${currentAbbreviation}${paddedCounter}`;

  // Push the generated participant ID to the array of used IDs
  usedParticipantIDs.push(participantID);

  // Increment the participant ID counter by 1 if the last registered user's abbreviation is "ALI"
  if (abbreviation === "ALI") {
    participantIDCounter++;
  } else {
    // Increment the house abbreviation index and reset the participant ID counter
    houseAbbreviationIndex = (houseAbbreviationIndex + 1) % 4;
    if (houseAbbreviationIndex === 0) {
      participantIDCounter++;
    }
  }

  return participantID;
}

// Function to generate unique ID
async function generateUniqueID(category) {
  const categoryID = getCategoryID(category);

  // console.log("This is the Category ID generated:", categoryID);

  // Define house abbreviations within the function
  const houseAbbreviations = ["ABU", "UMR", "UTH", "ALI"]; // Adjusted sequence

  // Fetch the last user from the database
  const lastUser = await UserAccountRegistration.findOne()
    .sort({ $natural: -1 })
    .limit(1);

  // console.log("This is last user in the database:", lastUser);

  let participantID;
  if (lastUser && lastUser.uniqueID) {
    // console.log("This is the last user uniqueID:", lastUser.uniqueID);

    // Extract the participant ID from the last unique ID
    const lastParticipantID = lastUser.uniqueID.split("-").pop();
    // console.log(
    //   "This is the last user participant ID extracted from the last registered user unique ID:",
    //   lastParticipantID
    // );

    // Get the index of the last user's abbreviation
    const lastIndex = houseAbbreviations.indexOf(
      lastParticipantID.substring(0, 3)
    );

    // Calculate the index of the next abbreviation
    const nextIndex = (lastIndex + 1) % houseAbbreviations.length;

    // Get the next abbreviation
    const nextAbbreviation = houseAbbreviations[nextIndex];

    // Generate a new participant ID using the updated counter
    participantID = generateParticipantID(nextAbbreviation);
    // console.log(
    //   "This is the participant ID of the new user with the next house abbreviation:",
    //   participantID
    // );
  } else {
    // Generate participant ID without incrementing the counter
    participantID = generateParticipantID();
    // console.log(
    //   "This is the participant ID of the new user if the last user participant ID is not ALI:",
    //   participantID
    // );
  }

  // Generate the unique ID
  const uniqueID = `TOYCAC24-${categoryID}-${participantID}`;

  return uniqueID;
}

// Generate first 20 unique IDs for category "student"
// const firstTwentyUniqueIDs = [];
// for (let i = 0; i < 20; i++) {
//   const uniqueID = await generateUniqueID("student");
//   firstTwentyUniqueIDs.push(uniqueID);
// }

// console.log(firstTwentyUniqueIDs);
