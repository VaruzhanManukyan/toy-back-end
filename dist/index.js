"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const passport_1 = __importDefault(require("passport"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_jwt_1 = require("passport-jwt");
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const role_enum_1 = require("./shared/enums/role-enum");
const error_middleware_1 = __importDefault(require("./middlewares/error-middleware"));
const role_middleware_1 = __importDefault(require("./middlewares/role-middleware"));
const auth_middleware_1 = __importDefault(require("./middlewares/auth-middleware"));
const auth_router_1 = __importDefault(require("./router/auth-router"));
const supplier_router_1 = __importDefault(require("./router/supplier-router"));
const device_router_1 = __importDefault(require("./router/device-router"));
const publisher_router_1 = __importDefault(require("./router/publisher-router"));
const scenario_router_1 = __importDefault(require("./router/scenario-router"));
const audio_file_router_1 = __importDefault(require("./router/audio-file-router"));
const toy_type_router_1 = __importDefault(require("./router/toy-type-router"));
const personage_object_state_router_1 = __importDefault(require("./router/personage-object-state-router"));
const personage_object_router_1 = __importDefault(require("./router/personage-object-router"));
const description_state_router_1 = __importDefault(require("./router/description-state-router"));
const right_transaction_router_1 = __importDefault(require("./router/right-transaction-router"));
const toy_router_1 = __importDefault(require("./router/toy-router"));
const user_router_1 = __importDefault(require("./router/user-router"));
const user_model_1 = __importDefault(require("./models/user-model"));
require("dotenv").config();
const PORT = process.env.PORT || "5000";
const app = (0, express_1.default)();
const corsOptions = {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
};
const applyCors = (request, response, next) => {
    const excludedPaths = ["/api/get_toy_media", "/api/get_media_file_ids"];
    if (excludedPaths.includes(request.url)) {
        next();
    }
    else {
        (0, cors_1.default)(corsOptions)(request, response, next); // Cast next to NextFunction to satisfy TypeScript
    }
};
app.use(applyCors);
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(passport_1.default.initialize());
app.use(express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
const jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_ACCESS_SECRET_KEY,
};
passport_1.default.use(new passport_jwt_1.Strategy(jwtOptions, (jwtPayload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(jwtPayload.id);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    }
    catch (error) {
        done(error, false);
    }
})));
app.use((0, cors_1.default)(corsOptions));
app.use("/api/scenario", scenario_router_1.default);
app.use("/api/audio_file", audio_file_router_1.default);
app.use("/api/auth", auth_router_1.default);
app.use("/api/user", auth_middleware_1.default, (0, role_middleware_1.default)([role_enum_1.Roles.SUPER_ADMIN]), user_router_1.default);
app.use("/api/device", auth_middleware_1.default, (0, role_middleware_1.default)([role_enum_1.Roles.SUPER_ADMIN]), device_router_1.default);
app.use("/api/right_transaction", auth_middleware_1.default, (0, role_middleware_1.default)([role_enum_1.Roles.SUPER_ADMIN]), right_transaction_router_1.default);
app.use("/api/supplier", auth_middleware_1.default, (0, role_middleware_1.default)([role_enum_1.Roles.SUPER_ADMIN]), supplier_router_1.default);
app.use("/api/toy_type", auth_middleware_1.default, (0, role_middleware_1.default)([role_enum_1.Roles.SUPER_ADMIN]), toy_type_router_1.default);
app.use("/api/toy", auth_middleware_1.default, (0, role_middleware_1.default)([role_enum_1.Roles.SUPER_ADMIN]), toy_router_1.default);
app.use("/api/personage_object_state", auth_middleware_1.default, (0, role_middleware_1.default)([role_enum_1.Roles.SUPER_ADMIN]), personage_object_state_router_1.default);
app.use("/api/personage_object", auth_middleware_1.default, (0, role_middleware_1.default)([role_enum_1.Roles.SUPER_ADMIN]), personage_object_router_1.default);
app.use("/api/description_state", auth_middleware_1.default, (0, role_middleware_1.default)([role_enum_1.Roles.SUPER_ADMIN]), description_state_router_1.default);
app.use("/api/publisher", auth_middleware_1.default, (0, role_middleware_1.default)([role_enum_1.Roles.SUPER_ADMIN]), publisher_router_1.default);
app.use("/api/uploads-audio", auth_middleware_1.default, (0, role_middleware_1.default)([role_enum_1.Roles.SUPER_ADMIN]), express_1.default.static(path_1.default.join(__dirname, "..", "uploads-audio")));
app.use("/api/uploads-image", auth_middleware_1.default, (0, role_middleware_1.default)([role_enum_1.Roles.SUPER_ADMIN]), express_1.default.static(path_1.default.join(__dirname, "..", "uploads-image")));
// Error handling middleware
app.use(error_middleware_1.default);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.DB_URL);
        app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
    }
    catch (error) {
        console.log(`Server error: ${error}`);
    }
});
startServer();
