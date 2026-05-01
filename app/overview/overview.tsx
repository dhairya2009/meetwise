import React from "react";
import "./overview.css";

const Q2PlanningCard = () => {
  return (
    <div className="window">
      {/* Mac top bar */}
      <div className="window-bar">
        <div className="dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <p className="url">meetwise.app/meetings/q2-planning</p>
      </div>

      {/* Card content */}
      <div className="card">
        <div className="header">
          <div>
            <h2 className="title">Q2 Planning Session</h2>
            <p className="meta">42 min · April 8, 2026</p>
          </div>
          <span className="status">Completed</span>
        </div>

        <hr />

        <div className="section">
          <h4 className="section-title">SUMMARY</h4>
          <p className="summary-text">
            The team aligned on Q2 priorities: launching the API v2 by May 15th,
            redesigning onboarding, and hiring two frontend engineers. Budget of
            $180k approved.
          </p>
        </div>

        <div className="bottom">
          <div className="column">
            <h4 className="section-title">ACTION ITEMS</h4>
            <ul className="list">
              <li>
                <input type="checkbox" /> Prepare launch strategy
              </li>
              <li>
                <input type="checkbox" /> Finalize QA plan
              </li>
              <li>
                <input type="checkbox" /> Post job listings
              </li>
            </ul>
          </div>

          <div className="column">
            <h4 className="section-title">DECISIONS</h4>
            <ul className="list decisions">
              <li>API v2 launches May 15th</li>
              <li>$180k budget approved</li>
              <li>Onboarding is top priority</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Q2PlanningCard;
