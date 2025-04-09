import { useEffect, useState,  lazy, Suspense } from "react";
import { useDispatch } from "react-redux";
import { getAllCurrencyRateAction } from './redux/slice/currency/getAllCurrencySlice';
import { ToastContainer } from 'react-toastify';
import { notify } from './utils/utils';
import 'react-toastify/dist/ReactToastify.css';
const DashBoard = lazy(() => import("./pages/dashBoard/DashBoard"));

function App() {
  const dispatch = useDispatch();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => {
      const status = navigator.onLine;
      setIsOnline(status);

      if (status) {
        dispatch(getAllCurrencyRateAction());
        notify("You are back online. Data has been refreshed.", "success");
      } else {
        notify("You are offline. Showing last known data.", "warn");
      }
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    if (isOnline) {
      dispatch(getAllCurrencyRateAction());
    }

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, [dispatch, isOnline]);

  return (
    <>
      <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
      <section className="min-h-screen bg-[#0F0F1B] text-white w-full">
        <DashBoard />
        <ToastContainer />
      </section>
    </Suspense>
    </>
  );
}

export default App;
