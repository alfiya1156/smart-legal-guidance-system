
export async function trackActivity(activity, activityType) {
  try {
    const storedUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (!storedUser?.id) {
      console.warn("User not logged in");
      return;
    }

    const response = await fetch(
      "http://localhost:5000/api/activity",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: storedUser.id,
          activity,
          activity_type: activityType,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save activity");
    }

    console.log("Activity saved:", activity);
  } catch (error) {
    console.error("Activity tracking error:", error);
  }
}
