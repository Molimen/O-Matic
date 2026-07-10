export type messageTypeCheck = 'info' | 'error';

export default function MessageInformation({
  name, message, messageType
}: {
  name: string;
  message: string;
  messageType: messageTypeCheck
}) {
  let colorType;
  let bgColorType;

  if (messageType === "info") {
    colorType = "text-neon-green";
    bgColorType = "bg-linear-to-r from-emerald-800/70 to-transparent to-90%";
  } else if (messageType === "error") {
    colorType = "text-error";
    bgColorType = "bg-linear-to-r from-red-800/70 to-transparent to-90%";
  } else {
    colorType = "text-white"
  }

  return (
    <>
      <div className="relative flex flex-col gap-2">
        <label className="text-[16px] uppercase tracking-[0.2em] font-bold text-secondary px-1">
          {name}
        </label>

        <span className={`transition duration-350 w-full rounded-sm py-4 px-6 text-xl ${colorType} ${bgColorType}`}>
          {message}
        </span>
      </div>
    </>
  )
}