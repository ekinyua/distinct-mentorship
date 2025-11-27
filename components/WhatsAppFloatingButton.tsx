export function WhatsAppFloatingButton() {
  const phoneNumber = "254728730069";
  const message = encodeURIComponent(
    "Hi, I would like to learn more about Distinct Mentorship services."
  );

  const href = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="focus-ring fixed bottom-5 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-[#1ebe5d]"
      aria-label="Chat with Distinct Mentorship on WhatsApp"
    >
      <span className="text-lg" aria-hidden>
        📲
      </span>
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  );
}
