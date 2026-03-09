export default function CertificateCard({ certificate }: any) {

  const status = certificate.approved
    ? "Approved"
    : certificate.rejected
    ? "Rejected"
    : "Pending";

  const statusColor =
    status === "Approved"
      ? "text-green-400 border-green-400/30"
      : status === "Rejected"
      ? "text-red-400 border-red-400/30"
      : "text-yellow-400 border-yellow-400/30";

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6">

      <div className="flex justify-between items-center">
        <h3 className="text-white font-medium">
          Certificate ID: {certificate.id}
        </h3>

        <span className={`text-xs px-3 py-1 rounded-full border ${statusColor}`}>
          {status}
        </span>
      </div>

      <div className="text-sm text-gray-400 space-y-1">
        <div>IPFS Hash: {certificate.ipfsHash}</div>
        <div>Institute: {certificate.institute}</div>
      </div>

    </div>
  );
}