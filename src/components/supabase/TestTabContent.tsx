
import React from 'react';
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TestTabContentProps {
  title: string;
  count: number;
  isLoading?: boolean;
  onCreateTest?: () => void;
  isCreating?: boolean;
  children: React.ReactNode;
}

const TestTabContent = ({ 
  title, 
  count, 
  isLoading, 
  onCreateTest, 
  isCreating, 
  children 
}: TestTabContentProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title} ({count})</h3>
        <div className="flex items-center gap-2">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {onCreateTest && (
            <Button onClick={onCreateTest} size="sm" disabled={isCreating}>
              {isCreating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Criar Teste
            </Button>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-2 max-h-60 overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  );
};

export default TestTabContent;
