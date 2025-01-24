import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Printer, ArrowLeft } from "lucide-react";

function Preview() {
  const location = useLocation();
  const navigate = useNavigate();

  const { invoiceData, shopDetails } = location.state || {};
  if (!invoiceData || !shopDetails) {
    navigate("/");
    return null;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center print:hidden">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Form
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Printer className="h-5 w-5 mr-2" />
            Print
          </button>
        </div>

        {/* Printable Content */}
        <div id="printable-content" className="bg-white rounded-lg shadow">
          <div className="p-8">
            {/* Invoice Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold">INVOICE</h1>
              <h2 className="text-xl">{shopDetails.name}</h2>
              <p className="text-sm text-gray-600">{shopDetails.address}</p>
            </div>

              {/* Invoice Details */}
              <div className="flex justify-between mb-8">
                <div className="w-1/2">
                  <h3 className="font-bold mb-2">Invoice to:</h3>
                  <p className="uppercase">{invoiceData.name}</p>
                  <p>{invoiceData.phone}</p>
                </div>
                <div>
                  <p>
                    <strong>Invoice No:</strong> INV-{Date.now()}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Table Content */}
              <table className="w-full mb-8 border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left border font-bold">SERVICE</th>
                    <th className="px-4 py-2 text-left border font-bold">QTY</th>
                    <th className="px-4 py-2 text-left border font-bold">PRICE</th>
                    <th className="px-4 py-2 text-left border font-bold">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="border px-4 py-2">{item.cardName}</td>
                      <td className="border px-4 py-2">{item.quantity}</td>
                      <td className="border px-4 py-2">Rs.{item.price.toFixed(2)}</td>
                      <td className="border px-4 py-2">
                        Rs.{(item.quantity * item.price + item.printingCharges).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="text-right mb-8">
                <div className="space-y-2">
                  <p>
                    <strong>Sub-total:</strong> Rs.{invoiceData.subTotal.toFixed(2)}
                  </p>
                  <p>
                    <strong>GST (18%):</strong> Rs.{invoiceData.gst.toFixed(2)}
                  </p>
                  <p className="text-xl font-bold border-t pt-2">
                    Total: Rs.{invoiceData.total.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="mb-8">
                <h3 className="font-bold mb-2">Payment Information</h3>
                <p>Payment Method: {invoiceData.paymentMethod.toUpperCase()}</p>
                <p>GSTIN: {shopDetails.gstin}</p>
              </div>

              {/* Footer */}
              <div className="text-center text-sm border-t pt-4">
                <p>{shopDetails.address}</p>
                <p>{shopDetails.phone} | {shopDetails.email}</p>
                <p className="font-bold mt-4">Thank you for your business!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Preview;
