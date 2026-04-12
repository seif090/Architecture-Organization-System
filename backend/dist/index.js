"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./config");
const db_1 = require("./db");
const routes_1 = require("./routes");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "ERP API" });
});
app.use("/api", routes_1.router);
(0, db_1.initDb)()
    .then(() => {
    app.listen(config_1.config.port, () => {
        console.log(`ERP API running on port ${config_1.config.port}`);
    });
})
    .catch((error) => {
    console.error("Database initialization failed", error);
    process.exit(1);
});
