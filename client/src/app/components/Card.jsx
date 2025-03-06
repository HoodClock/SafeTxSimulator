export default function Card({ title, children }) {
  return (
    <div className="bg-gray-800 p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-white text-lg mb-4">{title}</h2>
      {children}
    </div>
  );
}
