import { apiUrl } from "@/assets/variables";
import { Button } from "@/components/Button";
import { Loader } from "@/components/Loader";
import { useUserStore } from "@/store/useUserStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router";

export const DetalleAdminUser = () => {
  const { countryCode } = useUserStore();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: filterUser = {}, isLoading } = useQuery({
    queryKey: ["usuario-admin", id],
    queryFn: async () => {
      const { data } = await axios.get(`${apiUrl}/users-admin/${id}`, {
        params: { countryCode },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return data;
    },
  });

  console.log(filterUser);
  return (
    <>
      {isLoading && <Loader />}
      <div className="mt-5 mb-5 flex items-center gap-2 text-lg pb-2">
        <img src="/icons/left-arrow.svg" width={15} height={15} />
        <button
          className="cursor-pointer hover:text-red-600"
          onClick={() => navigate("/usuarios")}
        >
          Volver
        </button>
      </div>
      <div className="max-w-[1150px] mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-red-500 pb-4 mt-2 mb-4">
          Usuario Administrativo
        </h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Información del Usuario
          </h2>
          <div className="bg-gray-100 p-4 rounded-lg flex justify-between">
            <div className="flex gap-20 mb-5">
              <div>
                <p className="text-gray-700">
                  <strong>Nombre:</strong> {filterUser?.name}
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> {filterUser.email}
                </p>
              </div>
              <div>
                <p className="text-gray-700">
                  <strong>Role:</strong> {filterUser?.role?.name}
                </p>
                <p className="text-gray-700">
                  <strong>Ultima modificación:</strong>{" "}
                  {new Date(filterUser?.updatedAt).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }
                  )}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button link="">Editar</Button>
              <Button link="">Inhabilitar</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
