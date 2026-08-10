import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import { Eye, EyeOff, Bell } from "lucide-react";
import { useLocation } from "react-router-dom";

import Sidebar from "../../../components/layout/Sidebar";
import { getProfile } from "../../auth/services/auth.service";
import api from "../../../config/api";
import { getProfileImageUrl } from "../../../utils/profileImage";

import "./Settings.css";

import avatarImg from "../../../assets/settings-image/Ellipse 77.png";
import searchImg from "../../../assets/settings-image/search-interface-symbol (2) 1.png";

/*
 * Convert a date into a human-readable relative time.
 */
const getRelativeTime = (date) => {
  if (!date) {
    return "Not updated yet";
  }

  const dateValue = new Date(date);

  if (Number.isNaN(dateValue.getTime())) {
    return "Not updated yet";
  }

  const now = new Date();
  const diff = now.getTime() - dateValue.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return "just now";
  }

  if (minutes < 60) {
    return `${minutes} minute${
      minutes === 1 ? "" : "s"
    } ago`;
  }

  if (hours < 24) {
    return `${hours} hour${
      hours === 1 ? "" : "s"
    } ago`;
  }

  if (days < 30) {
    return `${days} day${
      days === 1 ? "" : "s"
    } ago`;
  }

  if (months < 12) {
    return `${months} month${
      months === 1 ? "" : "s"
    } ago`;
  }

  return `${years} year${
    years === 1 ? "" : "s"
  } ago`;
};

export default function Settings() {
  const location = useLocation();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    profilePicture: "",
    passwordUpdatedAt: null,
  });

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [passwordTime, setPasswordTime] =
    useState("Not updated yet");

  /*
   * Password form
   */
  const [passwordForm, setPasswordForm] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const fileInputRef = useRef(null);

  /*
   * Load profile
   */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProfile();

        const user = response?.data;

        if (!user) {
          throw new Error(
            "Profile data not found"
          );
        }

        setProfile({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
          bio: user.bio || "",
          profilePicture:
            user.profilePicture || "",
          passwordUpdatedAt:
            user.passwordUpdatedAt || null,
        });
      } catch (err) {
        console.error(
          "Failed to load profile:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  /*
   * Navigate to the requested Settings section
   *
   * Supported URLs:
   * /settings#profile
   * /settings#personal-info
   * /settings#security
   */
  useEffect(() => {
    if (loading) {
      return;
    }

    const targetId =
      location.hash.replace("#", "");

    if (!targetId) {
      return;
    }

    const timer = setTimeout(() => {
      const targetElement =
        document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [location.hash, loading]);

  /*
   * Update password relative time.
   *
   * Date.now() is NOT called during render.
   */
  useEffect(() => {
    const updatePasswordTime = () => {
      setPasswordTime(
        getRelativeTime(
          profile.passwordUpdatedAt
        )
      );
    };

    updatePasswordTime();

    const interval = setInterval(
      updatePasswordTime,
      60 * 1000
    );

    return () => {
      clearInterval(interval);
    };
  }, [profile.passwordUpdatedAt]);

  /*
   * Profile text input changes
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  /*
   * Profile picture selection
   */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Profile picture must be smaller than 5MB."
      );
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only PNG, JPG, and WEBP images are allowed."
      );
      return;
    }

    setSelectedImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setProfile((prev) => ({
      ...prev,
      profilePicture: previewUrl,
    }));

    setMessage("");
    setError("");
  };

  /*
   * Remove profile picture
   */
  const handleRemoveImage = () => {
    setSelectedImage(null);

    setProfile((prev) => ({
      ...prev,
      profilePicture: "",
    }));

    setMessage("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /*
   * Save profile changes
   */
  const handleSaveChanges = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const formData = new FormData();

      formData.append(
        "firstName",
        profile.firstName
      );

      formData.append(
        "lastName",
        profile.lastName
      );

      formData.append(
        "email",
        profile.email
      );

      formData.append(
        "phone",
        profile.phone
      );

      formData.append(
        "bio",
        profile.bio
      );

      if (selectedImage) {
        formData.append(
          "profilePicture",
          selectedImage
        );
      }

      /*
       * Tell backend that the user wants to remove
       * the existing profile picture.
       */
      if (
        !selectedImage &&
        !profile.profilePicture
      ) {
        formData.append(
          "removeProfilePicture",
          "true"
        );
      }

      const response = await api.put(
        "/auth/profile",
        formData
      );

      /*
       * Axios response:
       *
       * response.data
       *   -> backend ApiResponse
       *
       * response.data.data
       *   -> updated user
       */
      const updatedUser =
        response?.data?.data;

      if (!updatedUser) {
        throw new Error(
          "Updated profile data was not returned"
        );
      }

      setProfile({
        firstName:
          updatedUser.firstName || "",

        lastName:
          updatedUser.lastName || "",

        email:
          updatedUser.email || "",

        phone:
          updatedUser.phone || "",

        bio:
          updatedUser.bio || "",

        profilePicture:
          updatedUser.profilePicture || "",

        passwordUpdatedAt:
          updatedUser.passwordUpdatedAt ||
          profile.passwordUpdatedAt ||
          null,
      });

      setSelectedImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      /*
       * Synchronize cached user
       */
      const existingUser =
        localStorage.getItem("user");

      if (existingUser) {
        try {
          const parsedUser =
            JSON.parse(existingUser);

          localStorage.setItem(
            "user",
            JSON.stringify({
              ...parsedUser,
              ...updatedUser,
            })
          );
        } catch {
          console.warn(
            "Could not update cached user."
          );
        }
      }

      setMessage(
        "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "Failed to update profile:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * Password input changes
   */
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  /*
   * Change password
   */
  const handleChangePassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordForm;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setError(
        "Please fill in all password fields."
      );
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "New password must be at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "New passwords do not match."
      );
      return;
    }

    if (currentPassword === newPassword) {
      setError(
        "New password must be different from current password."
      );
      return;
    }

    try {
      setChangingPassword(true);

      const response = await api.put(
        "/auth/change-password",
        {
          currentPassword,
          newPassword,
          confirmPassword,
        }
      );

      /*
       * Backend successfully changed password.
       * Update UI immediately.
       */
      const updatedPasswordTime =
        new Date().toISOString();

      setProfile((prev) => ({
        ...prev,
        passwordUpdatedAt:
          updatedPasswordTime,
      }));

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setMessage(
        response?.data?.message ||
          "Password changed successfully."
      );
    } catch (err) {
      console.error(
        "Failed to change password:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  /*
   * Loading state
   */
  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <div className="settings-content">
            <p>Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">

        {/* =========================
            TOP BAR
        ========================= */}

        <header className="topbar">
          <div className="page-header">
            <h1>Settings</h1>

            <p>
              Manage your account and profile
              preferences
            </p>
          </div>

          <div className="topbar-right">

            <div className="search-bar">
              <img
                src={searchImg}
                alt="Search"
                className="search-icon"
              />

              <input
                type="text"
                placeholder="Search tasks..."
              />
            </div>

            <div className="notification-bell">
              <Bell
                fill="#fbbf24"
                stroke="none"
                size={24}
              />

              <span className="notification-dot">
                1
              </span>
            </div>

          </div>
        </header>

        {/* =========================
            SETTINGS CONTENT
        ========================= */}

        <div className="settings-content">

          {message && (
            <div className="settings-success">
              {message}
            </div>
          )}

          {error && (
            <div className="settings-error">
              {error}
            </div>
          )}

          {/* =========================
              PROFILE PHOTO
          ========================= */}

          <div
            id="profile"
            className="card profile-photo-card"
          >

            <div className="avatar-preview">
              <img
                src={
                  profile.profilePicture
                    ? getProfileImageUrl(
                        profile.profilePicture
                      )
                    : avatarImg
                }
                alt="Profile"
              />
            </div>

            <div className="photo-actions">

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{
                  display: "none",
                }}
              />

              <div className="photo-buttons">

                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >
                  Change Photo
                </button>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleRemoveImage}
                >
                  Remove
                </button>

              </div>

              <span className="photo-hint">
                JPG, PNG upto 5MB
              </span>

            </div>
          </div>

          {/* =========================
              PERSONAL INFORMATION
          ========================= */}

          <form
            id="settings-form"
            onSubmit={handleSaveChanges}
          >
            <div
              id="personal-info"
              className="card form-card"
            >

              <h3>
                Personal Information
              </h3>

              <div className="form-row">

                <div className="input-group">
                  <label>
                    First Name
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={
                      handleInputChange
                    }
                    placeholder="John"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>
                    Last Name
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={
                      handleInputChange
                    }
                    placeholder="Smith"
                    required
                  />
                </div>

              </div>

              <div className="input-group full-width">
                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={
                    handleInputChange
                  }
                  required
                />
              </div>

              <div className="input-group full-width">
                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={
                    handleInputChange
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="input-group full-width">
                <label>
                  Bio (Optional)
                </label>

                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={
                    handleInputChange
                  }
                  maxLength={500}
                  placeholder="Experienced handyman and problem solver. Available for various tasks including furniture assembly, basic electrical work, and home organization. Professional, reliable, and detail-oriented."
                />
              </div>

              <button
                type="submit"
                className="btn btn-dark save-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>
          </form>

          {/* =========================
              ACCOUNT SECURITY
          ========================= */}

          <div
            id="security"
            className="card security-card"
          >

            <div className="security-info">

              <h3>
                Account Security
              </h3>

              <div className="password-details">

                <span className="label">
                  Password
                </span>

              </div>

            </div>

            {/* Password fields */}

            <form
              onSubmit={
                handleChangePassword
              }
            >

              {/* Current Password */}

              <div className="input-group full-width">
                <label>
                  Current Password
                </label>

                <div
                  className="password-input-wrapper"
                  style={{
                    position: "relative",
                  }}
                >
                  <input
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    name="currentPassword"
                    value={
                      passwordForm.currentPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    placeholder="Enter current password"
                    autoComplete="current-password"
                    required
                    style={{
                      paddingRight: "45px",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showCurrentPassword
                        ? "Hide current password"
                        : "Show current password"
                    }
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform:
                        "translateY(-50%)",
                      border: "none",
                      background:
                        "transparent",
                      cursor: "pointer",
                      padding: "4px",
                    }}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}

              <div className="input-group full-width">
                <label>
                  New Password
                </label>

                <div
                  className="password-input-wrapper"
                  style={{
                    position: "relative",
                  }}
                >
                  <input
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    name="newPassword"
                    value={
                      passwordForm.newPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    required
                    style={{
                      paddingRight: "45px",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showNewPassword
                        ? "Hide new password"
                        : "Show new password"
                    }
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform:
                        "translateY(-50%)",
                      border: "none",
                      background:
                        "transparent",
                      cursor: "pointer",
                      padding: "4px",
                    }}
                  >
                    {showNewPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}

              <div className="input-group full-width">
                <label>
                  Confirm New Password
                </label>

                <div
                  className="password-input-wrapper"
                  style={{
                    position: "relative",
                  }}
                >
                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={
                      passwordForm.confirmPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    required
                    style={{
                      paddingRight: "45px",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform:
                        "translateY(-50%)",
                      border: "none",
                      background:
                        "transparent",
                      cursor: "pointer",
                      padding: "4px",
                    }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Change Password button */}

              <button
                type="submit"
                className="btn btn-dark save-btn"
                disabled={changingPassword}
              >
                {changingPassword
                  ? "Changing Password..."
                  : "Change Password"}
              </button>

            </form>

            {/* Last updated */}

            <div className="password-details">
              <span className="hint">
                Last updated{" "}
                {passwordTime}
              </span>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}