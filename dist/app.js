"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const database_config_1 = __importDefault(require("./config/database.config"));
database_config_1.default.sync()
    .then(() => {
    console.log(`Database connected successfully`);
})
    .catch((err) => console.log(err));
const pages_1 = __importDefault(require("./routes/pages"));
const doctors_1 = __importDefault(require("./routes/doctors"));
const reports_1 = __importDefault(require("./routes/reports"));
const signUp_1 = __importDefault(require("./routes/signUp"));
const auth_1 = require("./middleware/auth");
const app = (0, express_1.default)();
// view engine setup
app.set("views", path_1.default.join(__dirname, "..", "views"));
app.set("view engine", "ejs");
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join("public")));
app.get('*', auth_1.checkUser);
app.use("/", pages_1.default);
app.use("/", signUp_1.default);
app.use("/doctors", doctors_1.default);
app.use("/reports", reports_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
exports.default = app;
