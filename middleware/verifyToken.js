import admin from "firebase-admin";

// Firebase Admin Initialization
if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase initialized with service account");
  } else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    console.log("✅ Firebase initialized with applicationDefault()");
  }
}

// Middleware to verify Firebase ID token
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 🔍 Log incoming auth header
  console.log("🔐 Incoming Authorization:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("⚠️ No Bearer token found");
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name || "",
    };

    console.log("✅ Token verified for:", decoded.email);
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(401).json({
      error: "Invalid or expired token",
      details: error.message,
    });
  }
};
