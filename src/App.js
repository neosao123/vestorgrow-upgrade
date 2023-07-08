import { BrowserRouter } from "react-router-dom";
import AllRoutes from "./routers/AllRoutes";
import { GlobalProvider } from "./context/GlobalContext";
function App() {
  return (
    <BrowserRouter>
      <GlobalProvider>
        <AllRoutes />
      </GlobalProvider>
    </BrowserRouter>
  );
}

export default App;
