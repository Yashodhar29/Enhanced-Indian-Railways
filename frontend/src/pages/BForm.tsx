import { useState, useEffect } from "react";
import axios from "axios";
import PageMeta from "../components/common/PageMeta";

interface TableRow {
  id: number; // React key
  "RAKE ID": string; // Explicitly define the RAKE ID column
  [key: string]: string | number | null;
}

const BForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<string>("sc_wadi");
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [headers, setHeaders] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string>();

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

  useEffect(() => {
    axios.get("http://localhost:3002/api/get-user-and-role", {
      withCredentials: true
    })
      .then(response => {
        console.log(response)
        setUserRole(response.data.role);
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });
  }, []);


  const fetchData = async (route: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3002/api/route/${route}`);
      if (res.data.success) {
        const formatted = res.data.data.map((row: any, idx: number) => {
          const newRow: TableRow = {
            id: idx + 1, // Keep as React key
            "RAKE ID": row["rake_id"] ? String(row["rake_id"]) : "", // Set RAKE ID from rake_id
          };
          for (const key in row) {
            if (key !== "rake_id") { // Exclude rake_id to avoid overwriting
              newRow[key] = row[key] !== null ? String(row[key]) : "";
            }
          }
          console.log(`Row ${idx + 1} RAKE ID:`, newRow["RAKE ID"]); // Debug log
          return newRow;
        });
        setTableData(formatted);

        // Get headers from first row if available
        if (formatted.length > 0) {
          setHeaders(Object.keys(formatted[0]).filter((key) => key !== "id"));
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
        title="Route Data Viewer | RailNova"
        description="View and analyze route data"
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Route Data Viewer
        </h3>

        <div className="mb-4 flex justify-between">
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 
              bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white text-gray-800"
          >
            {routes.map((route) => (
              <option
                key={route.value}
                value={route.value}
                className="bg-white dark:bg-gray-900 dark:text-white text-gray-800"
              >
                {route.label}
              </option>
            ))}
          </select>
          {(userRole === 'admin' || userRole === 'editor') &&
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          }
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <span className="ml-2">Loading data...</span>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-200 dark:border-gray-300 dark:bg-white/[0.15]">
                <tr>
                  {headers.map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider dark:text-white text-black"
                    >
                      {header.replace(/_/g, " ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                {tableData.map((row, rowIndex) => (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    {headers.map((header) => (
                      <td
                        key={`${row.id}-${header}`}
                        contentEditable={isEditing}
                        suppressContentEditableWarning={true}
                        tabIndex={0} // Ensure focusable
                        onKeyDown={async (e) => {
                          if ((e.key === "Enter" || e.keyCode === 13) && isEditing) {
                            e.preventDefault();
                            const currentCell = e.currentTarget;
                            const originalValue = row[header] || "";
                            const updatedValue = currentCell.textContent ?? "";

                            if (updatedValue !== originalValue) {
                              setTableData((prev) => {
                                const newData = [...prev];
                                newData[rowIndex] = { ...newData[rowIndex], [header]: updatedValue };
                                return newData;
                              });

                              const rakeId = row["RAKE ID"] || "UNKNOWN_RAKE_ID";

                              try {
                                await fetch(
                                  `http://localhost:3002/api/save-table?` +
                                  `tableName=${encodeURIComponent(selectedRoute)}` +
                                  `&rake_id=${encodeURIComponent(rakeId)}` +
                                  `&column=${encodeURIComponent(header)}` +
                                  `&value=${encodeURIComponent(updatedValue)}` +
                                  `&original=${encodeURIComponent(originalValue)}`
                                );
                              } catch (err) {
                                console.error("Fetch error:", err);
                              } finally {
                                currentCell.blur(); // ✅ always blur, success or fail
                              }
                            }
                          }
                        }}

                        className={`whitespace-nowrap px-4 py-2 text-sm outline-none ${row["ic"] === "Y"
                          ? "text-green-600 font-medium dark:text-green-300"
                          : row["fc"] === "Y"
                            ? "text-blue-600 font-medium dark:text-[#01BFFB]"
                            : "text-gray-600 dark:text-white"
                          }`}
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