import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

interface PayStub {
  id: string;
  employee_id: string;
  pay_period_start: string;
  pay_period_end: string;
  gross_pay: number;
  total_deductions: number;
  net_pay: number;
  breakdown: any; 
  file_url: string | null;
  status: string;
  created_at: string;
}

interface PayStubsProps {
  currentUser?: { id: string };
}

const supabase = createClient(
  import.meta.env.VITE_PUBLIC_SUPABASE_URL!,
  import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY!
);

/** Convert partial or incorrect URLs into real Supabase public URLs */
const normalizeFileUrl = (url: string | null) => {
  if (!url) return null;

  // If already a full valid URL
  if (url.startsWith("https://")) return url;

  // Otherwise convert relative path into full Supabase URL
  return `https://sxspdcofjldpexpzbugr.supabase.co/storage/v1/object/public/${url}`;
};

export default function PayStubs({ currentUser }: PayStubsProps) {
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [payStubs, setPayStubs] = useState<PayStub[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPayStub, setSelectedPayStub] = useState<PayStub | null>(null);

  useEffect(() => {
    if (currentUser?.id) fetchPayStubs();
  }, [currentUser, selectedYear]);

  /** Fetch pay stubs directly from Supabase table */
  const fetchPayStubs = async () => {
    setLoading(true);

    const startOfYear = `${selectedYear}-01-01`;
    const endOfYear = `${selectedYear}-12-31`;

    const { data, error } = await supabase
      .from("pay_stubs")
      .select("*")
      .eq("employee_id", currentUser?.id)
      .gte("pay_period_start", startOfYear)
      .lte("pay_period_start", endOfYear)
      .order("pay_period_start", { ascending: false });

    if (!error && data) {
      setPayStubs(data as PayStub[]);
    } else {
      console.error("Error fetching pay stubs:", error);
    }

    setLoading(false);
  };

  /** PDF Download */
  const handleDownload = (stub: PayStub) => {
    const url = normalizeFileUrl(stub.file_url);
    if (!url) return alert("No PDF available for this pay stub.");
    window.open(url, "_blank");
  };

  /** Modal Controls */
  const handleView = (stub: PayStub) => setSelectedPayStub(stub);
  const closeModal = () => setSelectedPayStub(null);

  const years = Array.from({ length: 5 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Pay Stubs</h2>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pay Stub List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <i className="ri-loader-line animate-spin text-4xl text-blue-600"></i>
          </div>
        ) : payStubs.length > 0 ? (
          <div className="space-y-4">
            {payStubs.map((stub) => (
              <div
                key={stub.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  {/* Pay Period */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="ri-money-dollar-circle-line text-xl text-blue-600"></i>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {new Date(stub.pay_period_start).toLocaleDateString()} -{" "}
                        {new Date(stub.pay_period_end).toLocaleDateString()}
                      </h3>

                      <span
                        className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                          stub.status === "processed"
                            ? "bg-green-100 text-green-600"
                            : stub.status === "pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {stub.status}
                      </span>
                    </div>
                  </div>

                  {/* Pay Summary */}
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Gross Pay</p>
                      <p className="font-bold text-gray-900">
                        ${stub.gross_pay.toFixed(2)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-600">Net Pay</p>
                      <p className="font-bold text-green-600">
                        ${stub.net_pay.toFixed(2)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(stub)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                      >
                        <i className="ri-eye-line mr-1"></i> View
                      </button>

                      <button
                        onClick={() => handleDownload(stub)}
                        className="bg-gray-200 px-3 py-2 rounded-lg"
                      >
                        <i className="ri-download-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-600">
            No pay stubs found for {selectedYear}
          </div>
        )}
      </div>

      {/* PAY STUB MODAL */}
      {selectedPayStub && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Pay Stub Details</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Pay Period */}
              <div>
                <h4 className="font-semibold mb-2">Pay Period</h4>
                <p>
                  {new Date(selectedPayStub.pay_period_start).toLocaleDateString()}{" "}
                  -{" "}
                  {new Date(selectedPayStub.pay_period_end).toLocaleDateString()}
                </p>
              </div>

              {/* Earnings & Deductions */}
              {selectedPayStub.breakdown && (
                <>
                  {selectedPayStub.breakdown.earnings && (
                    <div>
                      <h4 className="font-semibold mb-2">Earnings</h4>
                      <div className="space-y-1">
                        {Object.entries(
                          selectedPayStub.breakdown.earnings
                        ).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between text-gray-700"
                          >
                            <span>{key.replace(/_/g, " ").toUpperCase()}</span>
                            <span>${Number(value).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedPayStub.breakdown.deductions && (
                    <div>
                      <h4 className="font-semibold mb-2">Deductions</h4>
                      <div className="space-y-1">
                        {Object.entries(
                          selectedPayStub.breakdown.deductions
                        ).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between text-gray-700"
                          >
                            <span>{key.replace(/_/g, " ").toUpperCase()}</span>
                            <span>${Number(value).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Summary */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-bold">Net Pay</span>
                  <span className="text-xl text-green-600 font-bold">
                    ${selectedPayStub.net_pay.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* PDF Link */}
              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Paystub PDF</h4>

                {normalizeFileUrl(selectedPayStub.file_url) ? (
                  <a
                    href={normalizeFileUrl(selectedPayStub.file_url)!}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    View PDF File
                  </a>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No PDF was uploaded for this pay stub.
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => handleDownload(selectedPayStub)}
                  className={`flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg ${
                    normalizeFileUrl(selectedPayStub.file_url)
                      ? ""
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <i className="ri-download-line mr-2"></i>
                  Download PDF
                </button>

                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 px-4 py-3 rounded-lg"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
