import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ActionCardProps {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  title?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
}

export const ActionCard = ({ onClick, icon, label, title, variant = "default" }: ActionCardProps) => {
  return (
    <Card className="w-full max-w-md">
      {title && (
        <CardHeader className="pb-0">
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={title ? "pt-4 pb-4" : "py-4"}>
        <Button 
          variant={variant} 
          className="w-full" 
          onClick={onClick}
        >
          {icon}
          {label}
        </Button>
      </CardContent>
    </Card>
  );
};
