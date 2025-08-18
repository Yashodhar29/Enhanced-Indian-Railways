import { useState, useEffect } from "react";
import axios from "axios";
import PageMeta from "../components/common/PageMeta";

interface TableRow {
  id: number;
  [key: string]: string | number | null;
}

const BForm = () => {
  const routes = [
    { label: "SC-WADI", value: "sc_wadi" },
    { label: "WADI-SC", value: "wadi_sc" },
    { label: "GTL-WADI", value: "gtl_wadi" },
    { label: "WADI-GTL", value: "wadi_gtl" },
    { label: "UBL-HG", value: "ubl_hg" },
    { label: "HG-UBL", value: "hg_ubl" },
    { label: "LTRR-SC", value: "ltrr_sc" },
    { label: "SC-LTRR", value: "sc_ltrr" },
    { label: "PUNE-DD", value: "pune_dd" },
    { label: "DD-PUNE", value: "dd_pune" },
    { label: "MRJ-PUNE", value: "mrj_pune" },
    { label: "PUNE-MRJ", value: "pune_mrj" },
    { label: "SC-TJSP", value: "sc_tjsp" },
    { label: "TJSP-SC", value: "tjsp_sc" },
  ];


  const [selectedRoute, setSelectedRoute] = useState<string>("sc_wadi");
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [headers, setHeaders] = useState<string[]>([]);

  const fetchData = async (route: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`https://enhanced-indian-railways.onrender.com/api/route/${route}`);
      if (res.data.success) {
        const formatted = res.data.data.map((row: any, idx: number) => {
          const newRow: TableRow = { id: idx + 1 };
          for (const key in row) {
            newRow[key] = row[key] !== null ? String(row[key]) : "";
          }
          return newRow;
        });
        setTableData(formatted);

        // Get headers from first row if available
        if (formatted.length > 0) {
          setHeaders(Object.keys(formatted[0]).filter(key => key !== "id"));
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedRoute);
  }, [selectedRoute]);

  return (
    <>
      <PageMeta
        title="Route Data Viewer | Your Application"
        description="View and analyze route data"
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Route Data Viewer
        </h3>

        <div className="mb-4">
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {routes.map((route) => (
              <option key={route.value} value={route.value}>
                {route.label}
              </option>
            ))}
          </select>

        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <span className="ml-2">Loading data...</span>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:border-gray-300 dark:bg-white/[0.03]">
                <tr>
                  {headers.map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  dark:text-white text-gray-500"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {tableData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {headers.map((header) => (
                      <td
                        key={`${row.id}-${header}`}
                        className="whitespace-nowrap px-6 py-4 text-sm text-gray-500"
                      >
                        {row[header] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default BForm;