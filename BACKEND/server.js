const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
require("dotenv").config();
//new--------------------------------
const session = require("express-session");
const MongoStore = require("connect-mongo");
const crypto = require("crypto");
const cron = require("node-cron");
const moment = require("moment");
const Lab = require("./models/Oshini/lab_account/labAccount.js");
const LabSlot = require("./models/Oshini/lab_account/labSlot");
// Generate a random secret key
const secretKey = crypto.randomBytes(32).toString("hex");
console.log("Generated secret key:", secretKey);
// Set up session middleware
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/AgroNest",
    }),
  })
);
//end---------------------------------
const fs = require("fs");
//Nilupul
const articleRoutes = require("./routes/Nilupul/articleRoutes.js");

const PORT = process.env.PORT || 8070;
app.use(cors());
app.use(bodyParser.json());
mongoose
  .connect("mongodb://localhost:27017/AgroNest", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connection success!");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

const fertilizerRouter = require("./routes/Sudarshan/inventory_mgmt/fertilizers.js");
app.use("/fertilizer", fertilizerRouter);
const dealerRouter = require("./routes/Sudarshan/dealer_acc_mgmt/dealers.js");
app.use("/dealer", dealerRouter);
const farmerFeedbackRoutes = require("./routes/Veenath/farmerfeedbacks.js");
app.use("/api/feedbacks", farmerFeedbackRoutes);
const farmerReportRoutes = require("./routes/Veenath/farmerReports.js");
app.use("/api/reports/", farmerReportRoutes);
const farmerRouter = require("./routes/Thisaravi/farmers.js");
app.use("/Farmer", farmerRouter);
const soilTestRouter = require("./routes/Thisaravi/soilTests.js");
app.use("/SoilTest", soilTestRouter);
const PdfRouter = require("./routes/Thisaravi/PDFRoutes.js");
app.use("/pdfRouter", PdfRouter);
//const FAnalysis = require("./routes/Kande/FAnalysis.js");
//app.use("/FAnalysis",FAnalysis);
const TopFertilizer = require("./routes/Kande/TopFertilizerRoutes.js");
app.use("/topfertilizercategory", TopFertilizer);
const topsellingSchema = require("./routes/Kande/TopSellingRoutes.js");
app.use("/topdealer", topsellingSchema);
const topareasSchema = require("./routes/Kande/TopAreasRoutes.js");
app.use("/toparea", topareasSchema);
const userSchema = require("./routes/Kande/managerloginRoutes.js");
app.use(userSchema);
const adminadd = require("./routes/Kande/admin.js");
app.use("/api/admin", adminadd);
const labRouter = require("./routes/Oshini/lab_account/labAccounts.js");
app.use("/labAccount", labRouter);
const ItemRouter = require("./routes/Lasindu/ItemR");
app.use("/item", ItemRouter);
const OrderRouter = require("./routes/Lasindu/OrderR");
app.use("/order", OrderRouter);
const labSlotRouter = require("./routes/Oshini/lab_account/labSlots.js");
app.use("/labSlot", labSlotRouter);
const testRequestRouter = require("./routes/Oshini/test_request/testRequests.js");
app.use("/testRequest", testRequestRouter);
const dealerRoutes = require("./routes/Rahul/dealer.routes");
app.use(dealerRoutes);
const farmerRoutes = require("./routes/Rahul/farmer.routes");
app.use(farmerRoutes);
const labsRouter = require("./routes/Rahul/labs.js");
app.use("/labs", labsRouter);
const dealerReportRouter = require("./routes/Rahul/dealersReport.js");
app.use("/farmerReport", dealerReportRouter);
const replyRoutess = require("./routes/Rahul/reply.js");
app.use("/replies", replyRoutess);
const farmerReport = require("./routes/Rahul/farmerReport.js");
app.use("/farmerReport", farmerReport);
const adminRoutes = require("./routes/Rahul/adminRoutes.js");
app.use("/admin", adminRoutes);
const countDealer = require("./routes/Rahul/countCealer.js");
app.use(countDealer);
const inquiryCount = require("./routes/Rahul/inquiryCount.js");
app.use(inquiryCount);
const profileRoutes = require("./routes/Rahul/Profile.js");
app.use("/api/profile", profileRoutes);
app.use("/api/auth", adminRoutes);
const labReportRouter = require("./routes/Oshini/test_request/labReports.js");
app.use("/labReport", labReportRouter);
//------------------------------------------------------------------------------------------------------------------
cron.schedule("0 0 * * *", async () => {
  try {
    const currentDate = moment().startOf("day");

    const targetDate = currentDate.clone().add(3, "days").toDate();

    const labs = await Lab.find({}, "_id");
    const addTimeSlots = require("./routes/Oshini/lab_account/labSlotsUtility.js");

    for (const lab of labs) {
      await addTimeSlots(targetDate, lab._id);
    }

    console.log("Time slots added for all existing labs for the target date");
  } catch (error) {
    console.error("Error adding time slots:", error);
  }
});
//---------------------------------------------------------------------------------------------
cron.schedule("0 * * * *", async () => {
  try {
    const currentDateTime = moment();

    await LabSlot.updateMany(
      {
        timeSlots: {
          $elemMatch: { endTime: { $lt: currentDateTime.toDate() } },
        },
      },
      { $pull: { timeSlots: { endTime: { $lt: currentDateTime.toDate() } } } }
    );

    console.log("Expired time slots deleted");
  } catch (error) {
    console.error("Error deleting expired time slots:", error);
  }
});
//--------------------------------------------------------------------------------------------------------------------------
// const articlerouter = require("./routes/Nilupul/articleRoutes.js")
// app.use("/articleModel.js", articlerouter);
app.use("/api/articles", articleRoutes);

app.listen(PORT, () => {
  console.log(`Server is up and running on port number: ${PORT}`);
});
