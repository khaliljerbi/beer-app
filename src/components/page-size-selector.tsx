import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

interface PageSizeSelectorProps {
  currentSize: number;
  onSizeChange: (size: number) => void;
}

const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
  currentSize,
  onSizeChange,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Show:</span>
      <Select
        value={currentSize.toString()}
        onValueChange={(value) => onSizeChange(parseInt(value, 10))}
      >
        <SelectTrigger className="w-[70px] h-8">
          <SelectValue placeholder={currentSize.toString()} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="30">30</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectContent>
      </Select>
      <span className="text-sm text-muted-foreground">per page</span>
    </div>
  );
};

export default PageSizeSelector;
