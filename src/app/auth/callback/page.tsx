import { Suspense } from 'react';
import CallbackHandler from './CallbackHandler';

export const dynamic = 'force-dynamic'; // Required because you're using searchParams

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading callback...</div>}>
      <CallbackHandler />
    </Suspense>
  );
}
