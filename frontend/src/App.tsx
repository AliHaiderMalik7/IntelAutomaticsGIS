import "./App.css";
import { message } from "antd";
import AppRouter from "./router/AppRouter";
import "bootstrap/dist/css/bootstrap.min.css";


// Apply global configuration
message.config({
  top: 100, // Adjust vertical placement
  duration: 3, // Default duration for each message in seconds
  maxCount: 5, // Maximum number of messages displayed at a time
  prefixCls: "custom-ant-message", // Custom class name
});

function App() {
  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;
