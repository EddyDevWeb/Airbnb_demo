// src/pages/payments/MyPaymentsPage.tsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMyPayments, type Payment } from "../../services/payment.service";

export default function MyPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyPayments()
            .then(setPayments)
            .catch(() => toast.error("Error al cargar pagos"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-center mt-10">Cargando pagos...</p>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8">Mis Pagos</h1>

            {payments.length === 0 ? (
                <p className="text-center text-gray-500 py-16 text-lg">No tienes pagos registrados</p>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-500">Fecha</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-500">Monto</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-500">Método</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-500">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {payments.map((payment) => {
                                const status = typeof payment.status === "object" ? payment.status : null;
                                const method = typeof payment.paymentMethod === "object" ? payment.paymentMethod : null;
                                return (
                                    <tr key={payment._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm">{new Date(payment.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm font-semibold">${payment.amount}</td>
                                        <td className="px-6 py-4 text-sm">{method?.displayName || "N/A"}</td>
                                        <td className="px-6 py-4">
                                            {status && (
                                                <span
                                                    className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                                                    style={{ backgroundColor: status.color }}
                                                >
                                                    {status.name}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
