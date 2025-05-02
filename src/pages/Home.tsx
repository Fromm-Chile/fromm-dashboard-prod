export const Home = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-red-500 pb-4 text-center mt-10 mb-8">
        Bienvenid@!
      </h1>
      <div className="max-w-[1150px] mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-red-500 pb-4">
            Panel Administrativo Fromm Web
          </h1>
          <p className="text-gray-700 text-lg">
            Este es el sistema centralizado para gestionar cotizaciones,
            contactos y clientes. Aquí podrás acceder a todas las herramientas
            necesarias para optimizar tus procesos y mejorar la experiencia de
            tus clientes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Cotizaciones
            </h2>
            <p className="text-gray-500">
              Gestiona las cotizaciones de tus clientes.
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Contactos
            </h2>
            <p className="text-gray-500">
              Administra los contactos de tus clientes.
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Clientes
            </h2>
            <p className="text-gray-500">
              Consulta y gestiona la información de tus clientes.
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-10">
        <img
          src="https://pub-873e7884cc3b416fa7c9d881d5d16822.r2.dev/fromm-cover.jpeg"
          alt="Dashboard Illustration"
          className="rounded-lg shadow-lg mt-10"
          width={800}
          height={400}
        />
      </div>
    </>
  );
};
