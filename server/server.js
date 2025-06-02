require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const itemsRouter = require("./api/items"); // Your item routes
const jwt = require("jsonwebtoken"); // Import JWT
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const app = express();

// Use the correct CORS configuration
app.use(
  cors({
    origin: [
      "https://theinandoutapp.com",
      "https://cartracker-t4bc.onrender.com",
      "http://localhost:8081",
      "http://localhost:5000",
      "http://10.0.0.167:5000", // Add your local machine's IP
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use itemsRouter for item-related routes
app.use("/api/items", itemsRouter);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));



app.post("/create-checkout-session", async (req, res) => {
  try {
    const { email } = req.body;

    // ✅ Check if user is already Pro
    const user = await User.findOne({ email });
    if (user && user.plan === "pro") {
      return res.json({ alreadyPaid: true });
    }

    // ✅ Otherwise, create a new checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      metadata: {
        email: email,
      },
      line_items: [
        {
          price: "price_1RV3x300utQSZbpF7lQyv2Fl",
          quantity: 1,
        },
      ],
      success_url: "https://theinandoutapp.com/?success=true",
      cancel_url: "https://theinandoutapp.com/cancel",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
});


app.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const eventType = event.type;
  console.log(`📡 Stripe webhook received: ${eventType}`);

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        const email = event.data.object.metadata.email;
        if (!email) return;

        await User.findOneAndUpdate(
          { email },
          { $set: { plan: "pro" } },
          { new: true }
        );
        console.log(`✅ Upgraded ${email} to PRO`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        // Get customer email via Stripe API
        const customer = await stripe.customers.retrieve(customerId);
        const email = customer.email;

        if (email) {
          await User.findOneAndUpdate(
            { email },
            { $set: { plan: "free" } },
            { new: true }
          );
          console.log(`🔻 Downgraded ${email} to FREE (subscription ended)`);
        }
        break;
      }

      case "invoice.payment_failed": {
        const customerId = event.data.object.customer;

        const customer = await stripe.customers.retrieve(customerId);
        const email = customer.email;

        console.warn(`⚠️ Payment failed for ${email}`);
        // Optionally notify user or downgrade
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${eventType}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook processing error:", error.message);
    res.status(500).send("Internal server error in webhook");
  }
});






app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Received login request:", { email, password });

  try {
    let user = await User.findOne({ email });
    if (!user) {
      console.log("User not found with email:", email);
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match for user:", email);
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    console.log("Password matched successfully");

    // 🔁 Re-fetch user after compare to get updated `plan`
    user = await User.findOne({ email });
    console.log("🟢 User plan at login:", user.plan); // Add this

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log("✅ Token generated:", token);
    console.log("🟢 User plan at login:", user.plan);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      username: user.username,
      plan: user.plan || "free", // Should now be accurate
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// Register Route
app.post("/register", async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
