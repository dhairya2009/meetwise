import { Suspense } from "react";
import UploadStatusClient from "./StatusClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading status...</div>}>
      <UploadStatusClient />
    </Suspense>
  );
}
