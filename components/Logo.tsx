export default function Logo({ name }: { name: string }) {
  const isImage =
    typeof name === "string" &&
    (name.includes("blob:") || name.startsWith("http"));
  return (
    <div className="p-4 border-b bg-white shadow flex items-center">
      {isImage ? (
        <img
          src={name}
          alt="Logo"
          className="h-10 object-contain"
        />
      ) : (
        <h1 className="text-xl font-bold">{name}</h1>
      )}
    </div>
  );
}

