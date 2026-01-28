const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function diagnose() {
    console.log("=== Health Tracker Backend Diagnostics ===");
    console.log(`Node Version: ${process.version}`);
    console.log(`CWD: ${process.cwd()}`);

    const uris = [
        process.env.MONGO_URI,
        'mongodb://127.0.0.1:27017/healthtracker',
        'mongodb://localhost:27017/healthtracker'
    ].filter(Boolean).map(uri => {
        if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) return 'mongodb://' + uri;
        return uri;
    });

    for (const mongoUri of uris) {
        console.log(`\nTesting Connection to: ${mongoUri}`);
        try {
            await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
            console.log(`SUCCESS: Connected to ${mongoUri}`);
            await mongoose.disconnect();
            console.log("Database connection is working perfectly.");
            return;
        } catch (err) {
            console.error(`FAILED: ${err.message}`);
        }
    }

    console.log("\nCRITICAL FAILURE: Could not connect to MongoDB on any address.");
    console.log("=================================================");
    console.log("THE PROBLEM: The MongoDB Service is NOT RUNNING.");
    console.log("=================================================");
    console.log("\nHOW TO FIX IT (Official Windows Command):");
    console.log("1. Open PowerShell as ADMINISTRATOR.");
    console.log("2. Run this command: Start-Service MongoDB");
    console.log("\nOR use the Services App:");
    console.log("1. Press 'Win + R', type 'services.msc', press Enter.");
    console.log("2. Find 'MongoDB Server', right-click it, and click 'Start'.");
}

diagnose();
