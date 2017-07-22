var package = require('./../../package.json');

module.exports = {
    "_comment": "Application data made available to handlebars.",
    "name": "thelocalcollaborative.com",
    "description": "tlc.com and biz.tlc.com",
    "version": package.version || "",
    "environment": process.env.NODE_ENV || "development",
    "production": (process.env.NODE_ENV === "production")
}
