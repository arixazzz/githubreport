export const routeAccessMap = {
  "/dashboard": {
    auth: true,
  },

  "/api/project": {
    auth: true,
    roles: ["ADMIN"],
  },

  "/api/report": {
    auth: true,
    permissions: ["REPORT_GENERATE"],
  },
};
