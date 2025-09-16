import React, { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import { getExpenses } from "../api/expenseService";
import { getIncomes } from "../api/incomeService";

const Reports = () => {
  const [data, setData] = useState({
    totalExpenses: 0,
    totalIncome: 0,
    expenseCount: 0,
    incomeCount: 0,
    expensesByCategory: [],
    incomesBySource: [],
    monthlyTrend: [],
  });
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expensesRes, incomesRes] = await Promise.all([
        getExpenses(),
        getIncomes(),
      ]);

      const expenses = expensesRes.expenses || [];
      const incomes = incomesRes.incomes || [];

      // Filter by selected period
      const now = new Date();
      let filteredExpenses = expenses;
      let filteredIncomes = incomes;

      if (selectedPeriod === "thisMonth") {
        filteredExpenses = expenses.filter((exp) => {
          const expDate = new Date(exp.date);
          return (
            expDate.getMonth() === now.getMonth() &&
            expDate.getFullYear() === now.getFullYear()
          );
        });
        filteredIncomes = incomes.filter((inc) => {
          const incDate = new Date(inc.date);
          return (
            incDate.getMonth() === now.getMonth() &&
            incDate.getFullYear() === now.getFullYear()
          );
        });
      }

      // Group expenses by category
      const expensesByCategory = filteredExpenses
        .reduce((acc, expense) => {
          const existing = acc.find(
            (item) => item.category === expense.category
          );
          if (existing) {
            existing.amount += expense.amount;
            existing.count += 1;
          } else {
            acc.push({
              category: expense.category,
              amount: expense.amount,
              count: 1,
            });
          }
          return acc;
        }, [])
        .sort((a, b) => b.amount - a.amount);

      // Group incomes by source
      const incomesBySource = filteredIncomes
        .reduce((acc, income) => {
          const existing = acc.find((item) => item.source === income.source);
          if (existing) {
            existing.amount += income.amount;
            existing.count += 1;
          } else {
            acc.push({
              source: income.source,
              amount: income.amount,
              count: 1,
            });
          }
          return acc;
        }, [])
        .sort((a, b) => b.amount - a.amount);

      setData({
        totalExpenses: filteredExpenses.reduce(
          (sum, exp) => sum + exp.amount,
          0
        ),
        totalIncome: filteredIncomes.reduce((sum, inc) => sum + inc.amount, 0),
        expenseCount: filteredExpenses.length,
        incomeCount: filteredIncomes.length,
        expensesByCategory,
        incomesBySource,
      });
    } catch (error) {
      console.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedPeriod]);

  // Round the net balance to remove decimal places
  const netBalance = Math.round(data.totalIncome - data.totalExpenses);

  // Pie chart component
  const PieChart = ({ data, title }) => {
    const [hoveredSlice, setHoveredSlice] = useState(null);
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    if (total === 0) return <p className="text-gray-500">No data available</p>;

    const colors = [
      "#ef4444",
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#ec4899",
      "#6366f1",
      "#6b7280",
    ];

    let cumulativePercentage = 0;
    const slices = data.slice(0, 6).map((item, index) => {
      const percentage = (item.amount / total) * 100;
      const startAngle = cumulativePercentage * 3.6; // Convert to degrees
      cumulativePercentage += percentage;

      return {
        ...item,
        percentage,
        startAngle,
        color: colors[index % colors.length],
      };
    });

    return (
      <div>
        <h3 className="font-semibold mb-4">{title}</h3>
        <div className="flex items-center space-x-6">
          {/* CSS Pie Chart */}
          <div
            className="relative w-48 h-48 rounded-full overflow-hidden cursor-pointer"
            style={{
              background: `conic-gradient(${slices
                .map(
                  (slice) =>
                    `${slice.color} ${slice.startAngle}deg ${
                      slice.startAngle + slice.percentage * 3.6
                    }deg`
                )
                .join(", ")})`,
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              const x = e.clientX - rect.left - centerX;
              const y = e.clientY - rect.top - centerY;

              let angle = Math.atan2(y, x) * (180 / Math.PI);
              angle = (angle + 90 + 360) % 360;

              const slice = slices.find((s) => {
                const endAngle = s.startAngle + s.percentage * 3.6;
                return angle >= s.startAngle && angle <= endAngle;
              });
              setHoveredSlice(slice || null);
            }}
            onMouseLeave={() => setHoveredSlice(null)}
          >
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
              <div className="text-center">
                {hoveredSlice ? (
                  <>
                    <p className="text-xs font-medium">
                      {hoveredSlice.category || hoveredSlice.source}
                    </p>
                    <p className="text-sm font-bold">
                      ₹{Math.round(hoveredSlice.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {hoveredSlice.percentage.toFixed(1)}%
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium">Total</p>
                    <p className="text-lg font-bold">₹{Math.round(total)}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1">
            {slices.map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <div
                  className="w-4 h-4 rounded mr-3"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm">
                      {item.category || item.source}
                    </span>
                    <span className="text-sm font-medium">
                      ₹{Math.round(item.amount)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Financial Reports
          </h1>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="thisMonth">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 transition-all duration-300 group hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gray-600 rounded-xl flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Total Income
                  </h2>
                </div>
                <p className="text-3xl font-bold text-gray-600 mb-1">
                  ₹{Math.round(data.totalIncome)}
                </p>
                <p className="text-gray-600 text-sm">
                  {data.incomeCount} transactions
                </p>
              </div>

              <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 transition-all duration-300 group hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gray-600 rounded-xl flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Total Expenses
                  </h2>
                </div>
                <p className="text-3xl font-bold text-gray-600 mb-1">
                  ₹{Math.round(data.totalExpenses)}
                </p>
                <p className="text-gray-600 text-sm">
                  {data.expenseCount} transactions
                </p>
              </div>

              <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 transition-all duration-300 group hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gray-600 rounded-xl flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Net Balance
                  </h2>
                </div>
                <p className="text-3xl font-bold text-gray-600 mb-1">
                  ₹{netBalance}
                </p>
                <p className="text-gray-600 text-sm">
                  {netBalance >= 0 ? "Surplus" : "Deficit"}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                <PieChart
                  data={data.expensesByCategory}
                  title="Expenses by Category"
                />
              </div>

              <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                <PieChart
                  data={data.incomesBySource}
                  title="Income by Source"
                />
              </div>
            </div>

            {/* Top Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                  Top Expense Categories
                </h3>
                <div className="space-y-2">
                  {data.expensesByCategory.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border-l-4 border-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors rounded-r"
                    >
                      <div className="flex items-center">
                        <div className="bg-gray-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.category}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.count} transactions
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-600 text-lg">
                          ₹{Math.round(item.amount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {((item.amount / data.totalExpenses) * 100).toFixed(
                            1
                          )}
                          %
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                  </div>
                  Top Income Sources
                </h3>
                <div className="space-y-2">
                  {data.incomesBySource.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border-l-4 border-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors rounded-r"
                    >
                      <div className="flex items-center">
                        <div className="bg-gray-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.source}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.count} transactions
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-600 text-lg">
                          ₹{Math.round(item.amount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {((item.amount / data.totalIncome) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Reports;
