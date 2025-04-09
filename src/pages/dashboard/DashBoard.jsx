import React, { lazy, Suspense } from 'react';

const CurrencyConverter = lazy(() => import('../../components/currencyConverter/CurrencyConverter'));
const LatestExchangeChart = lazy(() => import('../../components/latestExchangeChart/LatestExchangeChart'));
const LiveRatesTable = lazy(() => import('../../components/liveRateTable/LiveRateTable'));

const DashBoard = () => {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-10 tracking-wide">
        💱 Currency Exchange Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 mb-10">
        {/* Currency Converter */}
        <div className="bg-[#1E1E2F] p-6 rounded-2xl shadow-lg h-full min-h-[400px]">
          <Suspense fallback={<div className="text-white text-center">Loading Converter...</div>}>
            <CurrencyConverter />
          </Suspense>
        </div>

        {/* Exchange Chart */}
        <div className="bg-[#1E1E2F] p-6 rounded-2xl shadow-lg">
          <Suspense fallback={<div className="text-white text-center">Loading Chart...</div>}>
            <LatestExchangeChart />
          </Suspense>
        </div>
      </div>

      {/* Live Exchange Table */}
      <div className="bg-[#1E1E2F] p-6 rounded-2xl shadow-lg">
        <Suspense fallback={<div className="text-white text-center">Loading Live Rates...</div>}>
          <LiveRatesTable />
        </Suspense>
      </div>
    </section>
  );
};

export default React.memo(DashBoard);
