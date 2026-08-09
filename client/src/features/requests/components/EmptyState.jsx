import React from "react";
import { Inbox, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyState({ activeTab, searchQuery, onReset }) {
  return (
    <div className="requests-empty-state">
      <div className="empty-icon-circle">
        <Inbox size={32} />
      </div>
      <h3>No requests found</h3>
      <p>
        {searchQuery
          ? `No requests matching "${searchQuery}". Try a different search term.`
          : activeTab !== "all"
          ? `You have no ${activeTab.toLowerCase()} requests right now.`
          : "You haven't requested to help on any tasks yet."}
      </p>

      <div className="empty-state-actions">
        {searchQuery || activeTab !== "all" ? (
          <button type="button" className="btn-empty-reset" onClick={onReset}>
            Reset Filters
          </button>
        ) : (
          <Link to="/feed" className="btn-browse-feed">
            <span>Browse Feed</span>
            <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}
