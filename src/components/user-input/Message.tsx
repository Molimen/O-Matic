export type messageTypeCheck = 'info' | 'error';

export default function MessageInformation({
  name, message, messageType
}: {
  name: string;
  message: string;
  messageType: messageTypeCheck
}) {
  let colorType

  if (messageType === "info") {
    colorType = "text-neon-green";
  } else if (messageType === "error") {
    colorType = "text-error";
  } else {
    colorType = "text-white"
  }

  return (
    <>
      <div className="relative flex flex-col gap-2">
        <span className="text-[16px] uppercase tracking-[0.2em] font-bold text-pink-500/80 px-1">
          {name}
        </span>

        <span className={`w-full bg-surface-container-highest border border-surface-container-highestest rounded-lg py-4 px-6 min-h-15 text-xl ${colorType}`}>
          {message}
        </span>
      </div>
    </>
  )
}