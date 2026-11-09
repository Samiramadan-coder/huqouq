// A short two-tone alert played with the Web Audio API (no audio file needed).
// Browsers may block sound until the user has interacted with the page; then
// this silently does nothing.
let context: AudioContext | null = null;

export function playAlertSound() {
  try {
    context ??= new AudioContext();
    if (context.state === "suspended") context.resume().catch(() => {});

    const start = context.currentTime;

    [880, 660, 880].forEach((frequency, index) => {
      const oscillator = context!.createOscillator();
      const gain = context!.createGain();
      const at = start + index * 0.18;

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.3, at + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);

      oscillator.connect(gain).connect(context!.destination);
      oscillator.start(at);
      oscillator.stop(at + 0.17);
    });
  } catch {
    // No Web Audio support: the overlay still shows
  }
}
