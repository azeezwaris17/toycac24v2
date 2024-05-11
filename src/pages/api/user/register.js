import connectDB from "../mongodb";
import UserAccountRegistration from "../../../models/user/create_user_account";
import nodemailer from "nodemailer";
import multer from "multer";
import bcrypt from "bcrypt";
import fs from "fs";
import { google } from 'googleapis';

const upload = multer({ dest: "public/uploads/proofOfPayment" });

connectDB();

// Load credentials from a JSON file
// Define the service account credentials


const credentials = {
  "type": "service_account",
  "project_id": "toycac24-419900",
  "private_key_id": "b38cc9c45f42f7d6aa654f24eca5cd8360ce385f",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDJJwMBTuk7eEsp\npadiFMcbXbN3MZUIRAk7XahgZQ9zfvIoMLDIqOu3THDaB1yLWWZ1nlrbjtyMjCiY\nPVVnR08tAWYTwB++ms8a2bKIUwh9TWyEoHpZS5fUZoe4WaoTumD0vfwtaUAPSR/d\nwsjJpjDOnx/uDXuouCVmHde80hLi0bu9Xd2Qoj+e9Z7Viez845WzV7seR48WxBmJ\n0CFLWhHrIKli+jee1LVO9xPv/Wbv0FAQvMeUOLt0Uvsyymeos0d5hv6KL9utpnpY\nXyWu4lbJsbzC0GfusAwgNm6YLmxi2R4RXf2enDXs/Kngk4PMfNVHQUvz68eFC0Tw\nHg/+EQ6JAgMBAAECggEAOaNnFgnhhPvsNavU8aLYhrvrv9zCQpMUPiGRLMXojoSy\nqNeC4IyetnA96guv9fIRDOTqTf16rv8+Zpk0jpp9Un0THdewgPJlI+F7adq5FQaJ\ncNt3E304rVEP1MBEntCKFbcWuoBtLbQbYHT/CeEIHTy1boYIiAj0FnW4qs9bQAis\n+rYsOJtsGL0+M86j+Xjyyy+AFOIwEbzEWtluC/6QQbQjoAuJVEl5ojlvPVJg+qPv\nA8M/co1fH+jKLnDtaIQPD+4KqZRtxZi0caN002IsDn3yTZXfM7FqvSXpRdtCnuUX\nQUVjsOeUNATUxMmmSMoS5bKXdg1psKP+6586BUZ2bQKBgQDnnARQGrX0XyY9owcF\nsyND/K/D+ReMqXw2docJouVhWZ7npq8X9xAHv5wigcn4Oz3QWdmK3Sd7g+EQ7Fr8\nG1ZM5gGg+Gxm8xDbDZmH4cQekWQ6uxtW5OFYKoCZrCpxfMyRdR9/hcAhV5n46hDS\n26K4U5+s/7Qz/rmQv1MwpbADIwKBgQDeVeZqX82Asvh+zk2FxmtRiNILZcYBeUCN\nNgX+81tREiKnWsefM3lm2oXE8CmO//kyAEe0N9cO33lX7gdTii42WpPgMuG99gA9\nT/sW4pNClcPynJGuHXFs3CQVZ9f3+q21KU1FO6VAAfrDC2OwwfPCdsRTko6wmf6p\nhZHFlkpIYwKBgE7LbUwzSiPRGxltFT6DK0Q9+y4Y2EIqhu+gc2B74r2z17PHqVnl\n27ZHIb87mJKy1NzFNJVhl8UVoMQ5JNsQEdQni/ZPjdGYb+uWPN1VmXssy4SPk0WE\nqIVuMEIXqHjjlFUIG6cuwaaWPvPH7eFOh5VeHbylYZEu38K21H6AX9kxAoGBANlB\nxy4a/4zLVddTcJ1QDn5V3CoXAS1fdpyGNcWzt3+44PP32SjP+8ltr1mJ9JIvvyoE\n7AxGpHd8F+68QZx4Yj/qsqVaEwy03fcLuKfcL1nZTug75n7ldniRhREFsBw5cJSe\nD0ufxRKO3KLK9lc6rx9PPvkLNTOMxzSPuKoC+gNRAoGAfw5n8V/Tplu1d5OpGuG5\n8g79vReqpBDgYwCi/WqIZkMxoiV+LFqu5tRa49uJjcbVhSONmTsX3RHRItxHvO1h\nHHwemB9PcgGngUgCy1UN/XqP2NzUYuNpExxcllX3wdSUIMTWWGKEYxvoZnve4ty+\nkjEj2uyloA+knsPIuR7vEKE=\n-----END PRIVATE KEY-----\n",
  "client_email": "toycac@toycac24-419900.iam.gserviceaccount.com",
  "client_id": "102162798731964732623",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/toycac%40toycac24-419900.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

// Set up authentication with Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Create a new instance of Google Sheets API
const sheets = google.sheets({ version: 'v4', auth });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    upload.single("proofOfPayment")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ message: "File upload failed" });
      } else if (err) {
        return res.status(500).json({ message: "An unknown error occurred" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Log the category selected by the user
      const category = req.body.category;

      // Log the required fields based on the selected category
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
      if (category === "student" && !req.body.institution) {
        additionalFieldsRequired = true;
      } else if (
        category === "iotb" &&
        (!req.body.institution || !req.body.yearOfGraduation)
      ) {
        additionalFieldsRequired = true;
      } else if (
        category === "children" &&
        (!req.body.guardianName || !req.body.guardianPhoneNumber)
      ) {
        additionalFieldsRequired = true;
      } else if (
        category === "nonTimsanite" &&
        (!req.body.healthCondition)
      ) {
        additionalFieldsRequired = true;
      }

      if (additionalFieldsRequired) {
        fs.unlinkSync("public/uploads/proofOfPayment/" + req.file.filename);
        return res.status(400).json({
          message:
            "Additional fields are required based on the selected category",
        });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const categoryID = getCategoryID(category);
      const participantID = generateParticipantID();
      const uniqueID = `TOYCAC24-${categoryID}-${participantID}`;

      const userData = new UserAccountRegistration({
        fullName: req.body.fullName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        homeAddress: req.body.homeAddress,
        category: req.body.category,
        institution: req.body.institution || "",
        yearOfGraduation: req.body.yearOfGraduation || "",
        guardianName: req.body.guardianName || "",
        guardianPhoneNumber: req.body.guardianPhoneNumber || "",
        medicalCondition: req.body.medicalCondition || "",
        healthCondition: req.body.healthCondition || "",
        proofOfPayment: req.file.filename, // Keep the filename only
        password: hashedPassword,
        uniqueID,
      });

      await userData.save();

      // Append data to Google Sheet
      await appendToSheet(userData);

      // Create a folder structure based on the registration date
      const registrationDate = new Date();
      const year = registrationDate.getFullYear();
      const month = (registrationDate.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const day = registrationDate.getDate().toString().padStart(2, "0");
      const folderPath = `public/uploads/proofOfPayment/${year}-${month}-${day}`;

      // Ensure the target directory exists
      fs.mkdir(folderPath, { recursive: true }, (err) => {
        if (err) {
          console.error("Error creating directory:", err);
          return res.status(500).json({ message: "Error creating directory" });
        } else {
          // Move the uploaded file to the target directory
          const oldPath = `public/uploads/proofOfPayment/${req.file.filename}`;
          const newPath = `${folderPath}/${req.file.filename}`;
          fs.rename(oldPath, newPath, (err) => {
            if (err) {
              console.error("Error moving file:", err);
              return res.status(500).json({ message: "Error moving file" });
            } else {
              console.log("File moved successfully");

              // Construct the imageUrl relative to the public directory
              const imageUrl = `/uploads/proofOfPayment/${year}-${month}-${day}/${req.file.filename}`;
              console.log(imageUrl);

              res.status(201).json({
                message: "Registration successful",
                fullName: req.body.fullName,
                uniqueID,
                imageUrl, // Include the URL in the response
              });

              sendEmail(req.body.email, req.body.fullName, uniqueID);
            }
          });
        }
      });
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Registration failed" });
  }
}

// Function to append data to the Google Sheet
async function appendToSheet(userData) {
  try {
    const spreadsheetId = '1Ezna-5Jcaf9Cp24xdvAxcA-Nw18N2qsa0EGE0QiATxs'; // Replace with your Google Sheet ID
    const range = 'Sheet1'; // Specify the range where you want to append data

    // Construct the request body
    const request = {
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource: {
        values: [
          [
            userData.fullName,
            userData.email,
            userData.phoneNumber,
            userData.uniqueID,
            userData.approved ? 'Yes' : 'No', 
            userData.proofOfPayment,
            // userData.role,
          ],
        ],
      },
    };

    // Append data to the Google Sheet
    const response = await sheets.spreadsheets.values.append(request);
    console.log('Data appended successfully:', response.data);
  } catch (error) {
    console.error('Error appending data to Google Sheet:', error);
  }
}

let participantCounter = 1;
let houseAbbreviationIndex = 0;

function generateParticipantID() {
  const houseAbbreviations = ["ABU", "UMR", "UTH", "ALI"];
  const currentAbbreviation = houseAbbreviations[houseAbbreviationIndex];
  const participantID = `${currentAbbreviation}${participantCounter
    .toString()
    .padStart(3, "0")}`;

  // Update counters for next iteration
  participantCounter++;
  houseAbbreviationIndex =
    (houseAbbreviationIndex + 1) % houseAbbreviations.length;

  return participantID;
}

function getCategoryID(category) {
  switch (category.toLowerCase()) {
    case "student":
      return "STD";
    case "iotb":
      return "IOTB";
    case "children":
      return "CHLD";
      case "nonTimsanite":
      return "NT";
    default:
      return "OTH";
  }
}

async function sendEmail(email, fullName, uniqueID) {
  try {
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 587,
      auth: {
        user: "02bb5fb91b8ca2",
        pass: "77276fdc826b5b",
      },
    });

    const mailOptions = {
      from: '"TOYCAC24 Committee" <timsanoyostate@gmail.com>', // Update with your email address
      to: email,
      subject: "TOYCAC'24 - Registration Successful",
      text: `Dear ${fullName},\n\nYour registration for TIMSAN Oyo State Camp and Conference 2024 has been successfully submitted. Your registration is pending approval by the admin.\n\nOnce approved, you can sign in using the following credentials:\nUsername: ${uniqueID}\nPassword: Your registered password \n\nThank you for registering!\n\nSincerely,\nThe TOYCAC'24 Committee`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
