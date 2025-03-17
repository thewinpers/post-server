const { telegramService } = require("../services");
// const { emailService } = require("../services");
const getUserAgent = require("../utils/getUserAgent");

module.exports.recordVisit = async (req, res, next) => {
  try {
    const { visitor } = req.body;

    res.status(200).json({ success: true });

    const { osName, browser, ua } = getUserAgent(req);
    const browserName = `${browser.name} ${browser.version}`;

    const message = `New visitor IP: ${visitor.IPv4} ${visitor.country_code}`;

    telegramService.sendMessage(message);

    // await emailService.sendNewWebsiteVisit(
    //   "thedev.samer@gmail.com",
    //   visitor,
    //   osName,
    //   browserName,
    //   ua
    // );

    // await emailService.sendNewWebsiteVisit(
    //   "khaledjehad777@gmail.com",
    //   visitor,
    //   osName,
    //   browserName,
    //   ua
    // );
  } catch (err) {
    res.status(200).json({ success: true });
  }
};
