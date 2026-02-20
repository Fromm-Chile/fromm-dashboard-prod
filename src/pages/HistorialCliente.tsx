import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../assets/variables";
import { useUserStore } from "../store/useUserStore";
import { Loader } from "../components/Loader";
import { ChevronLeft } from "lucide-react";

export const HistorialCliente = () => {
  const { countryCode } = useUserStore();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: { invoices = [], contacts = [] } = {}, isLoading } = useQuery({
    queryKey: ["userInvoices", id, countryCode],
    queryFn: async () => {
      const { data } = await axios.get(`${apiUrl}/admin/invoices/user/${id}`, {
        params: { countryCode },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {isLoading && <Loader />}
      <button
  className="mt-5 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-4"
  onClick={() => navigate(-1)}
>
  <ChevronLeft size={16} />
  Volver
</button>
      <div className="w-full bg-card border border-border rounded-2xl shadow-sm p-7 mb-12">
        <h1 className="text-2xl font-bold text-foreground pb-4 mt-2 mb-4">
          Historial del Cliente
        </h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Información del Usuario
          </h2>
          <div className="bg-muted/40 border border-border rounded-xl p-4 ">
            <div className="flex gap-20 mb-5">
              <div>
                <p className="text-foreground">
                  <strong>Nombre:</strong>{" "}
                  {invoices[0]?.user.name ||
                    contacts[0]?.name ||
                    "No disponible"}
                </p>
                <p className="text-foreground">
                  <strong>Email:</strong>{" "}
                  {invoices[0]?.user.email ||
                    contacts[0]?.email ||
                    "No disponible"}
                </p>
              </div>
              <div>
                <p className="text-foreground">
                  <strong>Teléfono:</strong>{" "}
                  {invoices[0]?.user.phone ||
                    contacts[0]?.phone ||
                    "No registrado"}
                </p>
                <p className="text-foreground">
                  <strong>Empresa:</strong>{" "}
                  {invoices[0]?.user.company ||
                    contacts[0]?.company ||
                    "No disponible"}
                </p>
                {invoices[0]?.user.rucPeru && (
                  <p className="text-foreground">
                    <strong>RUC:</strong> {invoices[0]?.user.rucPeru}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        {invoices.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Historial de Cotizaciones
            </h2>
            <div className="rounded-xl overflow-hidden border border-border">
              <table className="min-w-full bg-card">
                <thead className="bg-muted/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">#Cotización</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Comentario</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Monto</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invoices?.map((invoice: any) => (
                    <tr key={invoice.id} className="bg-card hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 text-sm text-foreground">{invoice.id}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{invoice.statusR.name}</td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {invoice.invoiceEvents[0]?.comment}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {new Intl.NumberFormat("es-CL", {
                          style: "currency",
                          currency: "CLP",
                        }).format(invoice.totalAmount || 0)}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {invoice.updatedAt
                          ? new Date(invoice.updatedAt).toLocaleDateString(
                              "es-ES",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )
                          : "No disponible"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {contacts.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Historial de Mensajes
            </h2>
            <div className="rounded-xl overflow-hidden border border-border">
              <table className="min-w-full bg-card">
                <thead className="bg-muted/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mensaje</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {contacts?.map((message: any) => (
                    <tr key={message.id} className="bg-card hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 text-sm text-foreground">{message.id}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{message.message}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{message.status.name}</td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {message.updatedAt
                          ? new Date(message.updatedAt).toLocaleDateString(
                              "es-ES",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )
                          : "No disponible"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
