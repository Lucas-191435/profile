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
    extract: "/client/extract",
    goals: "/client/goals",
    planning: "/client/planning",
    heritage: "/client/heritage",
    future: "/client/future",
    syncAccounts: "/client/sync-accounts",
  },
  consultant: {
    clients: "/consultant",
    dashboard: "/consultant/dashboard",
  },
};

export { PrivateRoutes, PublicRoutes };
