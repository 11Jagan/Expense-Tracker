import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { groupByCategory } from '../../utils/formatters';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

// Color palette for chart segments
const colorPalette = [
  '#4F46E5', // Indigo
  '#0EA5E9', // Sky
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#A855F7', // Purple
  '#06B6D4', // Cyan
];

const ExpenseChart = ({ expenses = [], title = 'Expenses by Category' }) => {
  // Group expenses by category
  const expensesByCategory = groupByCategory(expenses);
  
  // Prepare data for chart
  const categories = Object.keys(expensesByCategory);
  const amounts = Object.values(expensesByCategory);
  
  const chartData = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: categories.map((_, index) => colorPalette[index % colorPalette.length]),
        borderWidth: 1,
        borderColor: '#fff',
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 11,
          },
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            return chart.data.labels.map((label, i) => {
              const meta = chart.getDatasetMeta(0);
              const style = meta.controller.getStyle(i);
              const value = datasets[0].data[i];
              const total = datasets[0].data.reduce((acc, curr) => acc + curr, 0);
              const percentage = Math.round((value / total) * 100);
              
              return {
                text: `${label}: $${value.toFixed(2)} (${percentage}%)`,
                fillStyle: style.backgroundColor,
                strokeStyle: style.borderColor,
                lineWidth: style.borderWidth,
                hidden: isNaN(datasets[0].data[i]) || meta.data[i].hidden,
                index: i
              };
            });
          }
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };
  
  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No expense data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Pie data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;