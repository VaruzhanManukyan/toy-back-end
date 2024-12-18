import path from "path";
import passport from "passport";
import express, { Express, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import { Roles } from "./shared/enums/role-enum";

import errorMiddleware from "./middlewares/error-middleware";
import roleMiddleware from "./middlewares/role-middleware";
import authMiddleware from "./middlewares/auth-middleware";

import AuthRouter from "./router/auth-router";
import SupplierRouter from "./router/supplier-router";
import DeviceRouter from "./router/device-router";
import PublisherRouter from "./router/publisher-router";
import ScenarioRouter from "./router/scenario-router";
import AudioFileRouter from "./router/audio-file-router";
import ToyTypeRouter from "./router/toy-type-router";
import PersonageObjectStateRouter from "./router/personage-object-state-router";
import PersonageObjectRouter from "./router/personage-object-router";
import DescriptionStateRouter from "./router/description-state-router";
import RightTransactionRouter from "./router/right-transaction-router";
import ToyRouter from "./router/toy-router";
import UserRouter from "./router/user-router";

import AuthModel from "./models/user-model";

require("dotenv").config();

const PORT: string = process.env.PORT || "5000";
const app: Express = express();

const corsOptions = {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
};

const applyCors = (request: Request, response: Response, next: NextFunction) => {
    const excludedPaths: string[] = ["/api/get_toy_media", "/api/get_media_file_ids"];
    if (excludedPaths.includes(request.url)) {
        next();
    } else {
        cors(corsOptions)(request, response, next as NextFunction); // Cast next to NextFunction to satisfy TypeScript
    }
};

app.use(applyCors);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(morgan("common"));

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_ACCESS_SECRET_KEY as string,
};

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
        const user = await AuthModel.findById(jwtPayload.id);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

app.use(cors(corsOptions));

app.use("/api/scenario", ScenarioRouter);
app.use("/api/audio_file", AudioFileRouter);

app.use("/api/auth", AuthRouter);
app.use("/api/user", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]), UserRouter);
app.use("/api/device", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]), DeviceRouter);
app.use("/api/right_transaction", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]), RightTransactionRouter);
app.use("/api/supplier", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]), SupplierRouter);
app.use("/api/toy_type", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]), ToyTypeRouter);
app.use("/api/toy", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]), ToyRouter);
app.use("/api/personage_object_state", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]), PersonageObjectStateRouter);
app.use("/api/personage_object", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]), PersonageObjectRouter);
app.use("/api/description_state", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]), DescriptionStateRouter);
app.use("/api/publisher", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]), PublisherRouter);

app.use("/api/uploads-audio", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]), express.static(path.join(__dirname, "..", "uploads-audio")));
app.use("/api/uploads-image", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]), express.static(path.join(__dirname, "..", "uploads-image")));

// Error handling middleware
app.use(errorMiddleware);

const startServer = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.DB_URL as string);
        app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
    } catch (error) {
        console.log(`Server error: ${error}`);
    }
};

startServer();
