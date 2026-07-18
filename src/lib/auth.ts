import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import clientPromise from "./db";

const client = await clientPromise;
const db = client.db("softskills");

export const auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string || "mock-client-id",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string || "mock-client-secret",
        }
    }
});
