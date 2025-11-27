import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface Activity {
  id: string;
  type: "success" | "error" | "info";
  message: string;
  timestamp: Date;
}

interface ActivityLogProps {
  activities: Activity[];
}

const ActivityLog = ({ activities }: ActivityLogProps) => {
  const [visibleActivities, setVisibleActivities] = useState<Activity[]>([]);

  useEffect(() => {
    setVisibleActivities(activities.slice(-5).reverse());
  }, [activities]);

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-battle-energy" />;
      case "error":
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <AlertCircle className="w-5 h-5 text-primary" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "success":
        return "bg-battle-energy/20";
      case "error":
        return "bg-destructive/20";
      default:
        return "bg-primary/20";
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl border-2 border-muted/30">
      <h3 className="text-xl font-bold mb-4 text-foreground">ACTIVITY LOG</h3>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {visibleActivities.length === 0 ? (
          <p className="text-muted-foreground text-sm">No activities yet...</p>
        ) : (
          visibleActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border hover:border-primary/30 transition-all"
            >
              <div className={`p-2 rounded-lg ${getIconBg(activity.type)}`}>
                {getIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{activity.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
export type { Activity };
