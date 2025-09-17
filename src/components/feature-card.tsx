import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
  content: string;
}

export function FeatureCard({
  icon: Icon,
  iconColor,
  title,
  description,
  content
}: FeatureCardProps) {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-col items-center">
        <Icon className={`h-10 w-10 ${iconColor} mb-2`} />
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-foreground-light">
          {content}
        </p>
      </CardContent>
    </Card>
  );
}
