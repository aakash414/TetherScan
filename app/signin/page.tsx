"use client";

import { Suspense } from "react";
import SignInPage from "../../components/siginin-component";

export default function Page() {
  return (
    <Suspense>
      <SignInPage />
    </Suspense>
  );
}
