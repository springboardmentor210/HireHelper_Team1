import React from "react";

const FALLBACK_AVATAR =
  "https://i.pravatar.cc/40?img=1";

export default function ApplicantAvatars({
  applicants = [],
}) {
  const visibleApplicants =
    Array.isArray(applicants)
      ? applicants.slice(0, 3)
      : [];

  const applicantCount =
    Array.isArray(applicants)
      ? applicants.length
      : 0;

  return (
    <div className="applicant-avatars">
      <div className="avatar-stack">
        {visibleApplicants.map(
          (request, index) => {
            const requester =
              request?.requester || {};

            const fullName =
              `${requester.firstName || ""} ${
                requester.lastName || ""
              }`.trim() ||
              "Applicant";

            const profilePicture =
              requester.profilePicture ||
              FALLBACK_AVATAR;

            return (
              <img
                key={
                  request?._id ||
                  index
                }
                src={profilePicture}
                alt={fullName}
                className="avatar"
                onError={(event) => {
                  event.currentTarget.src =
                    FALLBACK_AVATAR;
                }}
              />
            );
          }
        )}
      </div>

      <span className="applicant-count">
        {applicantCount === 1
          ? "1 Applicant"
          : `${applicantCount} Applicants`}
      </span>
    </div>
  );
}