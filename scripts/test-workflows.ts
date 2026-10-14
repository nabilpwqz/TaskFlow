import { DataStore, getInitialStoreData } from "../src/server/db/store";
import { hashPassword, verifyPassword } from "../src/server/auth/password";
import { signToken, verifyToken } from "../src/server/auth/jwt";

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  process.env.JWT_SECRET = "test_environment_ephemeral_jwt_secret_for_suite_runner_only_32_chars";
}

async function runTestSuite() {
  console.log("=== TaskFlow Marketplace Automated Verification Suite ===");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Password security tests
  console.log("\n--- Module 1: Cryptographic Authentication ---");
  const samplePassword = "TestEntropyVerification_" + Math.random().toString(36).substring(2);
  const hash = await hashPassword(samplePassword);
  assert(hash !== samplePassword, "Password must be hashed, never stored as plaintext");
  assert(await verifyPassword(samplePassword, hash), "Correct password must verify successfully");
  assert(!(await verifyPassword("WrongPassword", hash)), "Invalid password must be rejected");

  // 2. JWT token lifecycle
  console.log("\n--- Module 2: Session & JWT Verification ---");
  const token = signToken({ userId: "u_test_1", email: "test@taskflow.com", role: "client" });
  assert(typeof token === "string" && token.length > 20, "JWT token must be properly signed");
  const payload = verifyToken(token);
  assert(payload?.userId === "u_test_1" && payload?.role === "client", "JWT payload claims must match");
  assert(verifyToken("invalid.token.string") === null, "Malformed tokens must return null");

  // 3. Services search, filter, and pagination
  console.log("\n--- Module 3: Marketplace Search & Filtering ---");
  const services = await DataStore.getServices({ q: "Next.js" });
  assert(services.items.length > 0, "Keyword search for 'Next.js' must return relevant services");
  const filteredCat = await DataStore.getServices({ category: "Graphic Design" });
  assert(
    filteredCat.items.every((s) => s.category.toLowerCase().includes("graphic")),
    "Category filter must isolate Graphic Design services"
  );

  // 4. Order creation & business constraints
  console.log("\n--- Module 4: Order Lifecycle & State Machine ---");
  const storeData = getInitialStoreData();
  const testClient = storeData.users.find((u) => u.role === "client")!;
  const testFreelancer = storeData.users.find((u) => u.role === "freelancer")!;
  const testService = storeData.services.find((s) => s.sellerId === testFreelancer._id)!;

  const newOrder = await DataStore.createOrder({
    clientId: testClient._id,
    serviceId: testService._id,
    packageId: "basic",
    requirements: "Automated test order specifications",
  });
  assert(newOrder.status === "IN_PROGRESS", "Newly activated order must start in IN_PROGRESS");
  assert(newOrder.price > 0, "Order price must be snapshotted from the database package");

  // 5. Delivery submission
  const deliveredOrder = await DataStore.updateOrderStatus(newOrder._id, "DELIVERED", {
    delivery: {
      message: "Here are the completed test deliverables",
      files: [{ name: "code.zip", url: "https://example.com/code.zip" }],
    },
  });
  assert(deliveredOrder?.status === "DELIVERED", "Order status must transition to DELIVERED");
  assert((deliveredOrder?.deliveries.length || 0) > 0, "Deliverable history must record submission");

  // 6. Approval & Completion
  const completedOrder = await DataStore.updateOrderStatus(newOrder._id, "COMPLETED");
  assert(completedOrder?.status === "COMPLETED", "Order status must transition to COMPLETED");
  assert(!!completedOrder?.completedAt, "Completion timestamp must be set");

  // 7. Verified review & aggregate recalculation
  console.log("\n--- Module 5: Verified Review System ---");
  const review = await DataStore.createReview({
    orderId: completedOrder!._id,
    clientId: testClient._id,
    rating: 5,
    comment: "Outstanding verification work! Delivered ahead of schedule.",
  });
  assert(review.rating === 5, "Review rating must be recorded accurately");

  // Duplicate review protection
  try {
    await DataStore.createReview({
      orderId: completedOrder!._id,
      clientId: testClient._id,
      rating: 4,
      comment: "Trying to submit duplicate review",
    });
    assert(false, "Duplicate review on same order must throw error");
  } catch (err: any) {
    assert(true, "Duplicate review rejected: " + err.message);
  }

  // 8. Admin Telemetry
  console.log("\n--- Module 6: Platform Governance & Telemetry ---");
  const metrics = await DataStore.getAdminMetrics();
  assert(metrics.usersCount > 0, "Admin metrics must calculate registered users");
  assert(metrics.grossVolume >= 0, "Admin metrics must calculate gross GMV");

  console.log(`\n=========================================`);
  console.log(`Tests Completed: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`=========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
