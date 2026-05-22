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
        <label className="text-[16px] uppercase tracking-[0.2em] font-bold text-pink-500/80 px-1">
          {name}
        </label>

        <span className={`w-full bg-surface-container-highest border-0 rounded-full py-4 px-6 text-xl ${colorType}`}>
          {message}
        </span>
      </div>
    </>
  )
}