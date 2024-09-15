import React, { useState } from "react";
import { SoracomClient } from "../services/SoracomClient"; 
import { Sim } from "../types/Sim"; 

interface SimSearchListProps {
  client: SoracomClient;
  onResults: (sims: Sim[]) => void;
}

const SimSearchList: React.FC<SimSearchListProps> = ({ client, onResults }) => {
  const [sims, setSims] = useState<Sim[]>([]);
  const [searchType, setSearchType] = useState<string>("name"); 
  const [searchValue, setSearchValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); 


  const fetchSims = async () => {
    if (!searchValue) return; 

    setLoading(true);
    setError(null);
    try {
      let results: Sim[] = [];
      switch (searchType) {
        case "name":
          results = await client.searchSimsByName(searchValue);
          break;
        case "group":
          results = await client.searchSimsByGroup(searchValue);
          break;
        case "tag":
          results = await client.searchSimsByTag(searchValue);
          break;
        case "status":
          results = await client.searchBimsByStatus(searchValue);
          break;
        case "sessionStatus":
          results = await client.searchSimsBySessionStatus(searchValue);
          break;
        case "subscriptionStatus":
          results = await client.searchSimsBySubscriptionStatus(searchValue);
          break;
        default:
          setError("Invalid search type");
          setLoading(false);
          return;
      }
      setSims(results);
      onResults(results); 
    } catch (err) {
      setError("Failed to fetch SIMs");
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log("handleSubmit");
    e.preventDefault();
    if (!searchValue) {
      setError("Please enter a search value");
      return;
    }
    setError(null);
    fetchSims();
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h3 className="text-2xl font-semibold text-center mb-4">SIM Search</h3>


      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2">Search Type:</label>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="name">Name</option>
            <option value="group">Group</option>
            <option value="tag">Tag</option>
            <option value="status">Status</option>
            <option value="sessionStatus">Session Status</option>
            <option value="subscriptionStatus">Subscription Status</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2">Search Value:</label>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Search
        </button>
      </form>


      {loading && <div className="mt-4 text-center text-gray-500">Loading SIMs...</div>}
      {error && <div className="mt-4 text-center text-red-500">{error}</div>}

      {sims.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">SIM Search Results</h3>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                  <th className="border p-2">SIM ID</th>
                  <th className="border p-2">Primary IMSI</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Speed Class</th>
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Online</th>
                  <th className="border p-2">Tags</th>
                </tr>
              </thead>
              <tbody>
                {sims.map((sim,index) => (
                  <tr key={sim.simId} className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}>
                    <td className="border p-2">{sim.tags.name}</td>
                    <td className="border p-2">{sim.simId}</td>
                    <td className="border p-2">{sim.primaryImsi}</td>
                    <td className="border p-2">{sim.status}</td>
                    <td className="border p-2">{sim.speedClass}</td>
                    <td className="border p-2">{sim.type}</td>
                    <td className="border p-2">{sim.sessionStatus.online}</td>
                    <td className="border p-2">
                      {Object.keys(sim.tags).map((tagKey) => (
                        <div key={tagKey}>
                          <strong>{tagKey}:</strong> {sim.tags[tagKey]}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimSearchList;
