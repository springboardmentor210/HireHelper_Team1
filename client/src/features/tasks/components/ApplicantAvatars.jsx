import React from "react";

const AVATARS = [
  "https://i.pravatar.cc/40?img=1",
  "https://i.pravatar.cc/40?img=2",
  "https://i.pravatar.cc/40?img=3",
];

export default function ApplicantAvatars({ count = 0 }) {
  return (
    <div className="applicant-avatars">
      <div className="avatar-stack">
        {AVATARS.slice(0, 3).map((src, i) => (
          <img key={i} src={src} alt="applicant" className="avatar" />
        ))}
      </div>
      <span className="applicant-count">+{count} Applicants</span>
    </div>
  );
}