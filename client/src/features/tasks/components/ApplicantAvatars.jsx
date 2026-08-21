import React from "react";

export default function ApplicantAvatars({
  applicants = [],
  applicantCount = 0,
}) {
  const visibleApplicants = Array.isArray(applicants)
    ? applicants.slice(0, 3)
    : [];

  const count = Number.isFinite(Number(applicantCount))
    ? Number(applicantCount)
    : 0;

  return (
    <div className="applicant-avatars">
      <div className="avatar-stack">
        {visibleApplicants.map((request, index) => {
          const requester = request?.requester || {};

          const fullName =
            `${requester.firstName || ""} ${
              requester.lastName || ""
            }`.trim() || "Applicant";

          const initials = fullName
            .split(/\s+/)
            .filter(Boolean)
            .map((name) => name.charAt(0))
            .join("")
            .slice(0, 2)
            .toUpperCase();

          const profilePicture =
            requester.profilePicture || "";

          return profilePicture ? (
            <img
              key={request?._id || index}
              src={profilePicture}
              alt={fullName}
              className="avatar"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div
              key={request?._id || index}
              className="avatar avatar-initials"
              title={fullName}
              aria-label={fullName}
            >
              {initials}
            </div>
          );
        })}
      </div>

      <span className="applicant-count">
        {count === 1
          ? "1 Applicant"
          : `${count} Applicants`}
      </span>
    </div>
  );
}