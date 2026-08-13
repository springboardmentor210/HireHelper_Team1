const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

export const getProfileImageUrl = (profilePicture) => {
  if (!profilePicture) {
    return "";
  }

  // Already an absolute URL
  if (
    profilePicture.startsWith("http://") ||
    profilePicture.startsWith("https://")
  ) {
    return profilePicture;
  }

  // Backend returns paths like:
  // /uploads/profiles/profile-123.png
  return `${SERVER_BASE_URL}${profilePicture.startsWith("/") ? "" : "/"}${profilePicture}`;
};