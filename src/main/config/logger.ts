import log4js from "log4js";

log4js.configure({
  appenders: {
    console: { type: "console", layout: { type: "pattern", pattern: "%[[%p | %d{yyyy/MM/dd hh:mm:ss O}]%] %m" } },
  },
  categories: { default: { appenders: ["console"], level: "info" } },
});
