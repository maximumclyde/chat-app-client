import { Header, ChatSidebar, ChatPage } from "..";

import "./AuthenticatedLayout.scss";

function AuthenticatedLayout() {
  return (
    <div className="authenticated-layout-container">
      <Header />
      <div className="authenticated-layout-body">
        <ChatSidebar />
        <ChatPage />
      </div>
    </div>
  );
}

export default AuthenticatedLayout;
