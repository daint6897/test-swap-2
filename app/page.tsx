'use client';
import dynamic from 'next/dynamic';

const SwapInterface = dynamic(
  () => import('./components/SwapInterface').then(mod => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        Loading...
      </div>
    )
  }
);

export default function Home() {
  return <SwapInterface />;
}
