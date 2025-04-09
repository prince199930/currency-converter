import React, { useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';

const CurrencyConverter = () => {
  const { currencyrate, loading } = useSelector((state) => state.getAllCurrencyRates);

  const conversionRates = useMemo(() => currencyrate?.conversion_rates || {}, [currencyrate]);

  const usdToInr = conversionRates['INR'];
  const inrToUsd = useMemo(() => (usdToInr ? 1 / usdToInr : null), [usdToInr]);

  const [amount, setAmount] = useState('');
  const [converted, setConverted] = useState(null);
  const [direction, setDirection] = useState('USD_TO_INR');

  const handleConvert = useCallback(() => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) return;

    const result =
      direction === 'USD_TO_INR' ? parsedAmount * usdToInr : parsedAmount * inrToUsd;

    setConverted(result.toFixed(2));
  }, [amount, direction, usdToInr, inrToUsd]);

  return (
    <section className="bg-[#1c1f2e] text-white p-6 rounded-2xl shadow-xl w-full max-w-md mx-auto h-full flex flex-col justify-between transition duration-300">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-60 text-gray-300">
          <FaSpinner className="animate-spin text-4xl text-purple-400 mb-2" />
          <p className="text-sm">Fetching rates...</p>
        </div>
      ) : (
        <>
          <div>
            <h3 className="text-xl font-bold mb-6">Currency Converter</h3>

            {/* Direction Selector */}
            <div className="mb-4">
              <label htmlFor="direction" className="block text-sm font-medium mb-2">
                Conversion Direction
              </label>
              <select
                id="direction"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="w-full p-3 bg-[#2a2e3f] text-white rounded-lg focus:outline-none"
              >
                <option value="USD_TO_INR">USD to INR</option>
                <option value="INR_TO_USD">INR to USD</option>
              </select>
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <label htmlFor="amount" className="block text-sm font-medium mb-2">
                Amount
              </label>
              <input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 bg-[#2a2e3f] text-white rounded-lg focus:outline-none"
              />
            </div>
          </div>

          {/* Convert Button and Result */}
          <div>
            <button
              onClick={handleConvert}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:brightness-110 text-white rounded-lg font-semibold transition"
              disabled={!amount}
            >
              Convert
            </button>

            {converted !== null && (
              <div className="mt-4 text-center text-base text-green-400 font-medium">
                Converted: {converted} {direction === 'USD_TO_INR' ? 'INR' : 'USD'}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default React.memo(CurrencyConverter);
