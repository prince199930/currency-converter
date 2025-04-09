import React from "react";
import { useSelector } from "react-redux";
import { FaSpinner } from "react-icons/fa";

const MAX_DISPLAY = 10;

const LiveRatesTable = () => {
  const { currencyrate, loading } = useSelector(
    (state) => state.getAllCurrencyRates
  );

  const conversionRates = currencyrate?.conversion_rates || {};
  const topCurrencies = Object.entries(conversionRates).slice(0, MAX_DISPLAY);

  return (
    <section className="mt-6 w-full max-w-5xl mx-auto bg-[#1E1E2F] text-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-center tracking-wide">
        🌍 Top {MAX_DISPLAY} Currency Rates (Against USD)
      </h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-40 text-gray-400">
          <FaSpinner className="animate-spin text-4xl text-green-400 mb-2" />
          <p className="text-sm">Fetching live rates...</p>
        </div>
      ) : topCurrencies.length === 0 ? (
        <p className="text-center text-gray-400">No currency data available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-[#2F3145] text-white">
                <th className="py-3 px-5 text-base font-semibold rounded-l-xl">
                  Currency
                </th>
                <th className="py-3 px-5 text-base font-semibold rounded-r-xl">
                  Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {topCurrencies.map(([currency, rate]) => (
                <tr
                  key={currency}
                  className="bg-[#292b3d] hover:bg-[#383a4f] transition-colors rounded-xl shadow-sm"
                >
                  <td className="py-3 px-5 font-medium rounded-l-xl">
                    {currency}
                  </td>
                  <td className="py-3 px-5 text-green-400 rounded-r-xl">
                    {rate.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default LiveRatesTable;
