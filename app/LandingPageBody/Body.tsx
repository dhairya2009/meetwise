import React from "react";
import "./body.css";
import OverviewCard from "../overview/overview";

const steps = [
  {
    id: "01",
    title: "Upload your meeting",
    desc: "Drop in any MP3 or MP4 file — or record directly. Supports calls from Zoom, Meet, Teams, and more.",
    icon: "⬆️",
    color: "blue",
  },
  {
    id: "02",
    title: "AI processes it",
    desc: "Meetwise transcribes the audio, understands the context, and extracts what matters — in under a minute.",
    icon: "⚙️",
    color: "purple",
  },
  {
    id: "03",
    title: "Get structured insights",
    desc: "Receive a clean summary, categorized action items with assignees, and a log of every key decision made.",
    icon: "📋",
    color: "green",
  },
];

function Body() {
  return (
    <div className="body_main">
      <div className="body_main_section1">
        <div className="heading">AI-Powered Meeting Intelligence</div>
        <div className="heading-h1">
          Never Lose Important <span>Decisions</span> from Your Meetings Again
        </div>
        <div className="heading-h3">
          Meetwise automatically turns meetings into structured summaries,
          action items, and decision logs — built for teams that move fast.
        </div>
        <div className="heading-btns">
          <a href="/uploadfile">
            <button className="btn1">Start Now</button>
          </a>
          <button className="btn2">
            <div className="play-btn">
              <div className="triangle-btn"></div>
            </div>
            See Demo
          </button>
        </div>
        <div className="heading-condition">
          No credit card required · Free plan available · Cancel anytime
        </div>
        <div className="heading-tustedby-head">
          Trusted by freelancers & teams worldwide
        </div>
        <div className="heading-trusting-company">
          <div className="company-name">Notion</div>
          <div className="company-name">Linear</div>
          <div className="company-name">Vercel</div>
          <div className="company-name">Figma</div>
          <div className="company-name">Slack</div>
        </div>
        <div className="img-photo">
          <OverviewCard />
        </div>
      </div>
      <div className="body_main_section2">
        <div className="heading2-h1">Sound familiar?</div>
        <div className="heading2-h3">
          Meetwise fixes the problems every team faces after meetings.
        </div>
        <div className="heading2-boxes">
          <div className="heading2-leftbox box">
            <div className="leftbox-heading">Before Meetwise</div>
            <span>
              {" "}
              <div className="red-box">
                <div className="red-box-cross1"></div>
                <div className="red-box-cross2"></div>
              </div>
              Important decisions get forgotten after meetings
            </span>
            <span>
              {" "}
              <div className="red-box">
                <div className="red-box-cross1"></div>
                <div className="red-box-cross2"></div>
              </div>
              Action items fall through the cracks
            </span>
            <span>
              {" "}
              <div className="red-box">
                <div className="red-box-cross1"></div>
                <div className="red-box-cross2"></div>
              </div>
              No one remembers who agreed to what
            </span>
            <span>
              {" "}
              <div className="red-box">
                <div className="red-box-cross1"></div>
                <div className="red-box-cross2"></div>
              </div>
              Hours wasted re-discussing old topics
            </span>
            <span>
              {" "}
              <div className="red-box">
                <div className="red-box-cross1"></div>
                <div className="red-box-cross2"></div>
              </div>
              Meeting notes are incomplete or never written
            </span>
          </div>
          <div className="heading2-rightbox box">
            <div className="rightbox-heading">With Meetwise</div>
            <span>Crystal-clear summaries every time</span>
            <span>Action items auto-assigned and tracked</span>
            <span>Every decision logged with full context</span>
            <span>Meeting history keeps everyone aligned</span>
            <span>AI writes the notes so you do not have to</span>
          </div>
        </div>
      </div>
      <div className="body_main_section3 how">
        <h2 className="headingsection3">How Meetwise works</h2>
        <p className="subheading">
          From upload to insights in three simple steps.
        </p>

        <div className="steps">
          {steps.map((step) => (
            <div className="step" key={step.id}>
              <div className={`icon-box ${step.color}`}>
                <span className="step-number">{step.id}</span>
                <span className="icon">{step.icon}</span>
              </div>

              <h3 className="title-main3">{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Body;
