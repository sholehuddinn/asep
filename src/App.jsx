import "./index.css";
import { RouterProvider } from 'react-router-dom';
import route from './routes';

function App() {
  return (
    <div className="font-poppins">
      <RouterProvider router={route} />
    </div>
  );
}

export default App;
