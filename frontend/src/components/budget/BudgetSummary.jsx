import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaExclamationCircle } from 'react-icons/fa';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { formatCurrency } from '../../utils/formatters';

const BudgetSummary = ({ budgets, monthlyExpenses = {} }) => {
  if (!budgets || budgets.length === 0) {
    return null;
  }

  // Calculate total budget and total spent
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = Object.values(monthlyExpenses).reduce((sum, amount) => sum + amount, 0);
  const remainingBudget = totalBudget - totalSpent;
  const percentageSpent = (totalSpent / totalBudget) * 100;

  // Determine status color and icon
  let statusColor = 'text-green-500';
  let statusBg = 'bg-green-100';
  let StatusIcon = FaCheckCircle;
  let statusText = 'On Track';

  if (percentageSpent > 90) {
    statusColor = 'text-red-500';
    statusBg = 'bg-red-100';
    StatusIcon = FaExclamationCircle;
    statusText = 'Over Budget';
  } else if (percentageSpent > 75) {
    statusColor = 'text-yellow-500';
    statusBg = 'bg-yellow-100';
    StatusIcon = FaExclamationTriangle;
    statusText = 'Approaching Limit';
  }

  // Find categories that are over budget
  const overBudgetCategories = budgets.filter(budget => {
    const spent = monthlyExpenses[budget.category] || 0;
    return spent > budget.amount;
  });

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Budget Summary</CardTitle>
        <Badge 
          variant={percentageSpent > 90 ? 'destructive' : percentageSpent > 75 ? 'warning' : 'success'}
          className="flex items-center gap-1"
        >
          <StatusIcon className="h-3.5 w-3.5" />
          <span>{statusText}</span>
        </Badge>
      </CardHeader>
      <CardContent>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
            <p className="text-xl font-bold">{formatCurrency(totalBudget)}</p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
            <p className="text-xl font-bold">{formatCurrency(totalSpent)}</p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground mb-1">Remaining</p>
            <p className={`text-xl font-bold ${remainingBudget < 0 ? 'text-destructive' : 'text-success'}`}>
              {formatCurrency(remainingBudget)}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Overall Budget Usage</span>
            <span className="text-sm font-medium">{percentageSpent.toFixed(0)}%</span>
          </div>
          <Progress 
            value={Math.min(percentageSpent, 100)}
            variant={percentageSpent > 90 ? 'danger' : percentageSpent > 75 ? 'warning' : 'success'}
            className="h-2.5"
          />
        </div>

        {overBudgetCategories.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-2">Categories Over Budget</h4>
            <div className="space-y-2">
              {overBudgetCategories.map(budget => {
                const spent = monthlyExpenses[budget.category] || 0;
                const overBy = spent - budget.amount;
                const percentage = (spent / budget.amount) * 100;
                
                return (
                  <div key={budget._id} className="flex justify-between items-center p-2 bg-destructive/10 rounded border border-destructive/20">
                    <div>
                      <p className="text-sm font-medium">{budget.category}</p>
                      <p className="text-xs text-destructive">
                        Over by {formatCurrency(overBy)} ({percentage.toFixed(0)}%)
                      </p>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{formatCurrency(spent)}</span>
                      <span className="text-muted-foreground"> / {formatCurrency(budget.amount)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetSummary;