function getAuthenticatedHeaderItems() {
  return [
    {
      key: "settings",
      label: "Settings",
      title: "Settings",
    },
    {
      key: "logout",
      label: "Log out",
      title: "Log out",
    },
  ];
}

export default getAuthenticatedHeaderItems;
