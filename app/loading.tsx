/** Formation lap: a thin progress line sweeps while the next page loads. */
export default function Loading() {
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center gap-5" role="status" aria-live="polite">
      <div className="relative h-px w-40 overflow-hidden bg-line-strong">
        <span className="scroll-cue absolute inset-y-0 left-0 w-1/2 bg-livery [animation-name:loading-sweep]" />
      </div>
      <p className="eyebrow">Formation lap</p>
      <style>{`@keyframes loading-sweep{from{transform:translateX(-100%)}to{transform:translateX(200%)}}`}</style>
    </div>
  );
}
