import { useState, useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface LocoData {
  route: string;
  DSL: {
    total: number;
    multi: number;
  };
  AC: {
    total: number;
    multi: number;
  };
}

interface WagonData {
  id: string;
  name: string;
  Loaded: number;
  Empty: number;
}

const allowedTables = [
  "SC-WADI", "WADI-SC", "GTL-WADI", "WADI-GTL", "UBL-HG", "HG-UBL",
  "LTRR-SC", "SC-LTRR", "PUNE-DD", "DD-PUNE", "MRJ-PUNE", "PUNE-MRJ",
  "SC-TJSP", "TJSP-SC"
];

const routeOrder = [
  "SC-WADI", "WADI-SC", "GTL-WADI", "WADI-GTL",
  "HG-UBL", "UBL-HG", "LTRR-SC", "SC-LTRR",
  "MRJ-PUNE", "PUNE-MRJ", "DD-PUNE", "PUNE-DD",
  "SC-TJSP", "TJSP-SC"
];

export default function Charts() {
  // Loco data state
  const [locoData, setLocoData] = useState<LocoData[]>([]);
  const [view, setView] = useState<"DSL" | "AC">("DSL");
  const [loadingLoco, setLoadingLoco] = useState(true);
  const [errorLoco, setErrorLoco] = useState<string | null>(null);

  // Wagon data state
  const [wagonData, setWagonData] = useState<WagonData[]>([]);
  const [loadingWagon, setLoadingWagon] = useState(true);
  const [errorWagon, setErrorWagon] = useState<string | null>(null);

  // Fetch locomotive data
  useEffect(() => {
    const fetchLocoData = async () => {
      try {
        const response = await fetch("http://localhost:3002/analysis/locos");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const apiData: LocoData[] = await response.json();
        const ordered = allowedTables.map(route => {
          const found = apiData.find(item => item.route === route);
          return found || {
            route,
            DSL: { total: 0, multi: 0 },
            AC: { total: 0, multi: 0 }
          };
        });

        setLocoData(ordered);
      } catch (err) {
        console.error("Fetch loco error:", err);
        setErrorLoco("Failed to load locomotive data");
      } finally {
        setLoadingLoco(false);
      }
    };

    fetchLocoData();
  }, []);

  // Fetch wagon data
  useEffect(() => {
    const fetchWagonData = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/wagon-summary");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data = await response.json();
        if (data.success) {
          const formattedData = data.data
            .map((item: any) => ({
              id: item.route,
              name: item.route,
              Loaded: Number(item.loaded_wagons) || 0,
              Empty: Number(item.empty_wagons) || 0
            }))
            .sort((a: WagonData, b: WagonData) => 
              routeOrder.indexOf(a.name) - routeOrder.indexOf(b.name));

          setWagonData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching wagon data:", error);
        setErrorWagon("Failed to load wagon data");
      } finally {
        setLoadingWagon(false);
      }
    };

    fetchWagonData();
  }, []);

  // Loco chart config
  const locoChartOptions: ApexOptions = {
    chart: { type: 'bar', height: 500, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, borderRadius: 4, columnWidth: '55%' } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: {
      categories: locoData.map(item => item.route),
      labels: { rotate: -45, style: { fontSize: '12px' } }
    },
    yaxis: { title: { text: 'Count' } },
    fill: { opacity: 1 },
    colors: view === 'DSL' ? ['#4CAF50', '#81C784'] : ['#2196F3', '#64B5F6'],
    legend: { position: 'top' },
    tooltip: { y: { formatter: (val) => val.toString() } }
  };

  const locoChartSeries = [
    { name: `Total ${view}`, data: locoData.map(item => item[view].total) },
    { name: `Multi ${view}`, data: locoData.map(item => item[view].multi) }
  ];

  // Wagon chart config
  const wagonChartOptions: ApexOptions = {
    chart: { type: 'bar', height: 500, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, borderRadius: 4, columnWidth: '55%' } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: {
      categories: wagonData.map(item => item.name),
      labels: { rotate: -45, style: { fontSize: '12px' } }
    },
    yaxis: { title: { text: 'Wagon Count' } },
    fill: { opacity: 1 },
    colors: ['#4CAF50', '#F44336'], // Green for loaded, red for empty
    legend: { position: 'top' },
    tooltip: { y: { formatter: (val) => val.toString() } }
  };

  const wagonChartSeries = [
    { name: 'Loaded Wagons', data: wagonData.map(item => item.Loaded) },
    { name: 'Empty Wagons', data: wagonData.map(item => item.Empty) }
  ];

  const isLoading = loadingLoco || loadingWagon;
  const hasError = errorLoco || errorWagon;

  return (
    <>
      <PageMeta
        title="Transport Analysis | Your Application"
        description="Analysis of locomotive and wagon usage"
      />
      <PageBreadcrumb pageTitle="Transport Analysis" />
      
      <div className="space-y-6">
        {/* Locomotive Analysis Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
            Locomotive Analysis
          </h3>

          {loadingLoco ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              <span className="ml-2">Loading locomotive data...</span>
            </div>
          ) : errorLoco ? (
            <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
              {errorLoco}
            </div>
          ) : (
            <>
              <div className="mb-6 flex gap-2">
                <button
                  onClick={() => setView("DSL")}
                  className={`rounded-lg px-4 py-2 text-sm ${
                    view === "DSL" ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  DSL Locos
                </button>
                <button
                  onClick={() => setView("AC")}
                  className={`rounded-lg px-4 py-2 text-sm ${
                    view === "AC" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  AC Locos
                </button>
              </div>

              <Chart
                options={locoChartOptions}
                series={locoChartSeries}
                type="bar"
                height={500}
              />
            </>
          )}
        </div>

        {/* Wagon Analysis Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
            Wagon Analysis (Empty vs Loaded)
          </h3>

          {loadingWagon ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              <span className="ml-2">Loading wagon data...</span>
            </div>
          ) : errorWagon ? (
            <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
              {errorWagon}
            </div>
          ) : (
            <Chart
              options={wagonChartOptions}
              series={wagonChartSeries}
              type="bar"
              height={500}
            />
          )}
        </div>
      </div>
    </>
  );
}