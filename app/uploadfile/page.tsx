"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import "./upload.css";

interface FileMetadata {
  name: string;
  size: string;
  duration: string;
}

interface UserForm {
  name: string;
  email: string;
  phone: string;
}

const ACCEPTED_FILE_TYPES = ".mp3, .mp4, audio/mpeg, video/mp4";
const PRICE_PER_STARTED_MINUTE = 10;
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

const formatFileSize = (sizeInBytes: number) => {
  return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
};

const formatDuration = (durationInSeconds: number) => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const calculatePrice = (durationInSeconds: number) => {
  const startedMinutes = Math.max(1, Math.ceil(durationInSeconds / 60));
  return startedMinutes * PRICE_PER_STARTED_MINUTE;
};

const getMediaDuration = (file: File) => {
  return new Promise<number>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const mediaElement = file.type.startsWith("video/")
      ? document.createElement("video")
      : document.createElement("audio");

    mediaElement.preload = "metadata";
    mediaElement.src = objectUrl;

    mediaElement.onloadedmetadata = () => {
      const duration = Number.isFinite(mediaElement.duration)
        ? mediaElement.duration
        : 0;

      URL.revokeObjectURL(objectUrl);
      resolve(duration);
    };

    mediaElement.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to read media metadata."));
    };
  });
};

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const [fileName, setFileName] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userForm, setUserForm] = useState<UserForm>({
    name: "",
    email: "",
    phone: "",
  });

  const processFile = async (file: File) => {
    setErrorMessage("");
    setFileName(file.name);
    setSelectedFile(file);

    try {
      const durationInSeconds = await getMediaDuration(file);

      setMetadata({
        name: file.name,
        size: formatFileSize(file.size),
        duration: formatDuration(durationInSeconds),
      });
      setCalculatedPrice(calculatePrice(durationInSeconds));
    } catch (error) {
      setSelectedFile(null);
      setMetadata(null);
      setCalculatedPrice(0);
      setErrorMessage(
        "We could not read that file. Please upload a valid MP3 or MP4 file.",
      );
      console.error(error);
    }
  };

  const handleFileSelection = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    await processFile(file);
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (!file) {
      return;
    }

    await processFile(file);
  };

  const handleUserInfoChange = (field: keyof UserForm, value: string) => {
    setUserForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setMetadata(null);
    setFileName("");
    setCalculatedPrice(0);
    setErrorMessage("");
    setIsDragging(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleCheckout = async () => {
    setErrorMessage("");

    if (!selectedFile || !metadata) {
      setErrorMessage("Please upload a file before proceeding to payment.");
      return;
    }

    if (!userForm.name || !userForm.email) {
      setErrorMessage("Please enter your name and email to continue.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("name", userForm.name);
      formData.append("email", userForm.email);
      formData.append("phone", userForm.phone);

      const response = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to start checkout.");
      }

      window.location.href = payload.checkoutUrl;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to start checkout.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="upload-page-shell">
      <section className="upload-page-content">
        <section className="upload-stage">
          <div className="upload-stage__left">
            <div
              className={`dropzone ${isDragging ? "dropzone--active" : ""}`}
              onClick={() => inputRef.current?.click()}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
            >
              <input
                ref={inputRef}
                type="file"
                hidden
                accept={ACCEPTED_FILE_TYPES}
                onChange={handleFileSelection}
              />

              <div className="dropzone__badge">Step 1</div>
              <h2>{fileName || "Choose your MP3 or MP4 file"}</h2>
              <p>Drag and drop here or click to browse from your device.</p>
            </div>

            {errorMessage && <p className="upload-error">{errorMessage}</p>}

            {metadata && (
              <div className="upload-details">
                <div className="upload-section-label">Uploaded file</div>
                <div className="upload-details__grid">
                  <div className="upload-details__card">
                    <span>File name</span>
                    <strong>{metadata.name}</strong>
                  </div>
                  <div className="upload-details__card">
                    <span>Duration</span>
                    <strong>{metadata.duration}</strong>
                  </div>
                  <div className="upload-details__card">
                    <span>Size</span>
                    <strong>{metadata.size}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  className="upload-clear-button"
                  onClick={clearSelection}
                >
                  Remove file
                </button>
              </div>
            )}
          </div>

          <div className="upload-stage__right">
            <div className="upload-section-label">Step 2</div>
            <h2 className="upload-panel-title">Add your contact details</h2>
            <p className="upload-panel-copy">
              We use these details to keep you updated on your transcription.
            </p>

            <div className="user-info-grid">
              <label className="field">
                <span>Name</span>
                <input
                  type="text"
                  id="user-name"
                  placeholder="Enter your name"
                  value={userForm.name}
                  onChange={(event) =>
                    handleUserInfoChange("name", event.target.value)
                  }
                />
              </label>

              <label className="field">
                <span>Email</span>
                <input
                  type="email"
                  id="user-email"
                  placeholder="Enter your email"
                  value={userForm.email}
                  onChange={(event) =>
                    handleUserInfoChange("email", event.target.value)
                  }
                />
              </label>

              <label className="field">
                <span>Phone number</span>
                <input
                  type="tel"
                  id="user-phone"
                  placeholder="Enter your phone number"
                  value={userForm.phone}
                  onChange={(event) =>
                    handleUserInfoChange("phone", event.target.value)
                  }
                />
              </label>
            </div>

            <div className="upload-price-card">
              <div>
                <p className="upload-price-card__label">Estimated price</p>
                <h3>Rs. {calculatedPrice}</h3>
                <p className="upload-price-card__caption">
                  Rs. 10 per started minute. No hidden fees.
                </p>
              </div>
              <button
                type="button"
                className="upload-pill upload-pill--primary"
                onClick={handleCheckout}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Redirecting to Stripe..." : "Pay and Transcribe"}
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
