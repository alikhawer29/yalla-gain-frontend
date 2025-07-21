import "bootstrap/dist/css/bootstrap.css";
import "./Assets/css/style.css";
import "./Assets/css/animate.min.css";
import "./Assets/css/fonts.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Routers from "./Routers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Routers />
  </QueryClientProvider>
);

export default App;
