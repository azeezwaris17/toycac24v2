import connectDB from "../mongodb";
import UserAccountRegistration from "../../../models/user/create_user_account";
import nodemailer from "nodemailer";
import multer from "multer";
import bcrypt from "bcrypt";
import fs from "fs";

const upload = multer({ dest: "public/uploads/proofOfPayment" });

connectDB();

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
      const uniqueID = `TOYCA24-${categoryID}-${participantID}`;

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
        proofOfPayment: req.file.filename, // Keep the filename only
        password: hashedPassword,
        uniqueID,
      });

      await userData.save();

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
