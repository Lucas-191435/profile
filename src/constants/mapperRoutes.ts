const PublicRoutes = {
  login: {
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    defaultPage: "/login",
  },
};

const PrivateRoutes = {
  client: {
    dashboard: "/client", 
    pokemonDetail: "/client/pokemon/[id]",
  },
  consultant: {
    clients: "/consultant",
    dashboard: "/consultant/dashboard",
  },
};

export { PrivateRoutes, PublicRoutes };
