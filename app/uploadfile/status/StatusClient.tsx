"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import "./status.css";

type ActionItem = {
  task: string;
  owner: string;
  deadline: string;
};

type Summary = {
  title: string;
  executiveSummary: string;
  keyTopics: string[];
  actionItems: ActionItem[];
  decisions: string[];
  followUps: string[];
};

type JobResponse = {
  id: string;
  status: string;
  customerName: string;
  customerEmail: string;
  originalFileName: string;
  amountInInr: number;
  durationMinutes: number;
  summary: Summary | null;
  reportReady: boolean;
  failureReason: string | null;
  downloadUrl: string | null;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

const statusLabels: Record<string, string> = {
  pending_payment: "Waiting for payment",
  payment_confirmed: "Payment confirmed",
  transcribing: "Transcribing with AssemblyAI",
  summarizing: "Creating summary with OpenAI",
  creating_report: "Building your PDF report",
  delivering: "Sending your result",
  completed: "Complete",
  failed: "Processing failed",
};

const progressSteps = [
  "payment_confirmed",
  "transcribing",
  "summarizing",
  "creating_report",
  "delivering",
  "completed",
];

function getProgressIndex(status: string) {
  const index = progressSteps.indexOf(status);
  return index === -1 ? 0 : index + 1;
}

export default function UploadStatusClient() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const payment = searchParams.get("payment");

  const [job, setJob] = useState<JobResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId || payment === "cancelled") {
      setLoading(false);
      return;
    }

    let active = true;
    let intervalId: number | undefined;

    const fetchJob = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`);
        const payload = (await response.json()) as JobResponse | { error: string };

        if (!response.ok || "error" in payload) {
          throw new Error("error" in payload ? payload.error : "Unable to load job");
        }

        if (!active) {
          return;
        }

        setJob(payload);
        setError("");
        setLoading(false);

        if (payload.status === "completed" || payload.status === "failed") {
          if (intervalId !== undefined) {
            window.clearInterval(intervalId);
          }
        }
      } catch (fetchError) {
        if (!active) {
          return;
        }

        setLoading(false);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load job status.",
        );
      }
    };

    fetchJob();
    intervalId = window.setInterval(fetchJob, 8000);

    return () => {
      active = false;
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [jobId, payment]);

  const progressLabel = useMemo(() => {
    if (!job) {
      return "Preparing status";
    }

    return statusLabels[job.status] || job.status.replaceAll("_", " ");
  }, [job]);

  return (
    <main className="status-shell">
      <section className="status-panel">
        <div className="status-kicker">MeetWise delivery status</div>
        <h1>
          {payment === "cancelled"
            ? "Payment cancelled"
            : payment === "success"
              ? "We are processing your meeting"
              : "Tracking your report"}
        </h1>
        <p className="status-copy">
          {payment === "cancelled"
            ? "No charge was completed. You can go back and restart checkout whenever you are ready."
            : "Your report starts only after Stripe confirms the payment. This page updates automatically."}
        </p>

        {payment === "cancelled" && (
          <div className="status-message status-message--warn">
            Your checkout was cancelled before payment confirmation.
          </div>
        )}

        {!jobId && (
          <div className="status-message status-message--error">
            Missing job ID. Start from the upload page to create a new request.
          </div>
        )}

        {error && (
          <div className="status-message status-message--error">{error}</div>
        )}

        {loading && payment !== "cancelled" && (
          <div className="status-card">
            <p className="status-eyebrow">Loading</p>
            <h2>Checking your latest status</h2>
          </div>
        )}

        {job && (
          <>
            <div className="status-grid">
              <article className="status-card">
                <p className="status-eyebrow">Current stage</p>
                <h2>{progressLabel}</h2>
                <p className="status-meta">
                  {`${job.originalFileName} | ${job.durationMinutes} billed minute(s) | Rs. ${job.amountInInr}`}
                </p>
              </article>

              <article className="status-card">
                <p className="status-eyebrow">Delivery</p>
                <h2>{job.customerName}</h2>
                <p className="status-meta">{job.customerEmail}</p>
              </article>
            </div>

            <div className="status-progress">
              {progressSteps.map((step, index) => {
                const complete = getProgressIndex(job.status) > index;
                const isActive = progressSteps[index] === job.status;

                return (
                  <div
                    className={`status-progress__step ${
                      complete ? "status-progress__step--done" : ""
                    } ${isActive ? "status-progress__step--active" : ""}`}
                    key={step}
                  >
                    <span>{index + 1}</span>
                    <strong>{statusLabels[step]}</strong>
                  </div>
                );
              })}
            </div>

            {job.status === "failed" && (
              <div className="status-message status-message--error">
                {job.failureReason || "Something went wrong while processing this file."}
              </div>
            )}

            {job.summary && (
              <section className="status-summary">
                <div className="status-summary__header">
                  <p className="status-eyebrow">Summary preview</p>
                  <h2>{job.summary.title}</h2>
                </div>
                <div className="status-summary__content">
                  <p>{job.summary.executiveSummary}</p>
                </div>
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}
