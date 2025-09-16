import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { formatCurrency } from '../../utils/formatters';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

const BudgetList = ({ budgets, onEdit, onDelete, loading, monthlyExpenses = {} }) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center py-8">
            <div className="animate-pulse flex space-x-4 w-full">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!budgets || budgets.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">No budget items found. Add a budget to get started.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate percentage spent for each budget category
  const calculatePercentage = (budget) => {
    const spent = monthlyExpenses[budget.category] || 0;
    const percentage = (spent / budget.amount) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Allocations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgets.map((budget) => {
            const percentage = calculatePercentage(budget);
            const spent = monthlyExpenses[budget.category] || 0;
            
            // Determine variant based on percentage
            let progressVariant = 'success';
            let statusVariant = 'success';
            
            if (percentage > 90) {
              progressVariant = 'danger';
              statusVariant = 'destructive';
            } else if (percentage > 75) {
              progressVariant = 'warning';
              statusVariant = 'warning';
            }
            
            return (
              <div key={budget._id} className="border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">{budget.category}</div>
                  <Badge variant={statusVariant}>
                    {percentage.toFixed(0)}%
                  </Badge>
                </div>
                
                <div className="mb-2">
                  <Progress value={percentage} variant={progressVariant} className="h-2" />
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-muted-foreground">Spent: </span>
                    <span className="font-medium">{formatCurrency(spent)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Budget: </span>
                    <span className="font-medium">{formatCurrency(budget.amount)}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(budget)} className="h-8 w-8 p-0">
                      <FaEdit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(budget._id)} className="h-8 w-8 p-0 text-destructive">
                      <FaTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetList;