interface LogAcivityResponse {
  id: number; // Unique identifier for the log activity
  userId: number; // ID of the user performing the activity
  activity: string; // The activity description (e.g., "User logged in")
  timestamp: Date; // Timestamp when the activity was created
  user: {
    id: number; // The user ID (foreign key relation)
    nama: string; // User's name
    usernamegithub: string; // GitHub username
    role: "USER" | "ADMIN"; // Role of the user
  }; // User object relation (the user who performed the activity)
}
