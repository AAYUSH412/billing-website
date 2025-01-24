import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, IndianRupee, QrCode, Trash2, Plus } from "lucide-react";
import { generateInvoicePDF, downloadPDF } from "../utils/generatePDF";

function WeddingCardOrderForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    paymentMethod: "cash",
    amountReceived: 0,
    items: [{ cardName: "", quantity: 1, price: 0, printingCharges: 0 }],
  });
  const navigate = useNavigate();

  const calculateSubTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + item.quantity * item.price + item.printingCharges;
    }, 0);
  };

  const calculateGST = () => {
    return calculateSubTotal() * 0.18; // 18% GST
  };

  const calculateTotal = () => {
    return calculateSubTotal() + calculateGST();
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { cardName: "", quantity: 1, price: 0, printingCharges: 0 },
      ],
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleGenerateBill = async () => {
    try {
      const invoiceData = {
        name: formData.name,
        phone: formData.phone,
        items: formData.items,
        subTotal: calculateSubTotal(),
        gst: calculateGST(),
        total: calculateTotal(),
        paymentMethod: formData.paymentMethod,
      };

      const shopDetails = {
        name: "Jalaram Cards",
        address: "Shop No. 123, Example Road, City, State, PIN - 123456",
        phone: "+91 1234567890",
        gstin: "GSTIN1234567890",
        email: "test@example",
      };

      const pdfBytes = await generateInvoicePDF(invoiceData, shopDetails);
      downloadPDF(pdfBytes, `invoice_${new Date().toISOString().split('T')[0]}.pdf`);
      alert('PDF generated successfully!');
    } catch (error) {
      console.error(error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handlePreview = () => {
    const invoiceData = {
      name: formData.name,
      phone: formData.phone,
      items: formData.items,
      subTotal: calculateSubTotal(),
      gst: calculateGST(),
      total: calculateTotal(),
      paymentMethod: formData.paymentMethod,
    };

    const shopDetails = {
      name: "Jalaram Cards",
      address: "Shop No. 123, Example Road, City, State, PIN - 123456",
      phone: "+91 1234567890",
      gstin: "GSTIN1234567890",
      email: "test@example",
    };

    navigate('/preview', { state: { invoiceData, shopDetails } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-orange-600 px-6 py-4">
          <h1 className="text-3xl font-bold text-center text-white">
            Wedding Card Order Form
          </h1>
        </div>

        <div className="p-6 space-y-8">
          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Customer Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  className="block w-full pl-10 rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          {/* Items List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </button>
            </div>

            {formData.items.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Card Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                      value={item.cardName}
                      onChange={(e) =>
                        updateItem(index, "cardName", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Printing Charges (₹)
                    </label>
                    <div className="mt-1 flex">
                      <input
                        type="number"
                        min="0"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        value={item.printingCharges}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "printingCharges",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="ml-2 inline-flex items-center p-2 border border-transparent rounded-md text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Price Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Sub Total:</span>
              <span>₹{calculateSubTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>GST (18%):</span>
              <span>₹{calculateGST().toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total Amount:</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
          {/* Payment Method */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Payment Method
            </h3>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  className="form-radio text-orange-600"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.paymentMethod === "cash"}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                />
                <span className="ml-2">Cash</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  className="form-radio text-orange-600"
                  name="paymentMethod"
                  value="gpay"
                  checked={formData.paymentMethod === "gpay"}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                />
                <span className="ml-2">Google Pay</span>
              </label>
            </div>

            {formData.paymentMethod === "gpay" && (
              <div className="flex justify-center p-4">
                <QrCode className="h-40 w-40 text-gray-700" />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handlePreview}
              className="flex-1 py-3 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Preview Bill
            </button>
            <button
              type="button"
              onClick={handleGenerateBill}
              className="flex-1 py-3 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              Generate PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeddingCardOrderForm;