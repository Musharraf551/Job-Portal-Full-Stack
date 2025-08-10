// src/utils/auth.js
import { jwtDecode } from "jwt-decode";

export function getUserInfo() {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded;  // contains standard JWT claims but not is_staff by default
  } catch {
    return null;
  }
}

// Fetch profile from backend
export async function fetchUserProfile() {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  const res = await fetch("http://127.0.0.1:8000/api/profile/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return null;
  return await res.json();  // returns { username, is_staff, ... }
}
