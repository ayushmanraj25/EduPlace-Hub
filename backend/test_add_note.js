async function test() {
  try {
    const res = await fetch("http://localhost:5001/api/notes/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: "Test Subject",
        topic: "Test Topic",
        content: "Test Content",
        userId: "test@example.com",
        role: "admin"
      })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Data:", data);
  } catch(e) {
    console.error("Fetch failed:", e);
  }
}
test();
