
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Tag } from "lucide-react";

const trendingStories = [
  { title: "Election Results Shape Local Policy", time: "3 hours ago" },
  { title: "New Technology Hub Opens Downtown", time: "5 hours ago" },
  { title: "Community Festival Draws Record Crowds", time: "1 day ago" },
  { title: "Environmental Initiative Gains Support", time: "2 days ago" }
];

const categories = [
  { name: "Politics", count: 45 },
  { name: "Business", count: 38 },
  { name: "Sports", count: 29 },
  { name: "Local", count: 52 },
  { name: "Education", count: 23 },
  { name: "Health", count: 31 }
];

const upcomingEvents = [
  { title: "City Council Meeting", date: "Dec 15" },
  { title: "School Board Election", date: "Dec 18" },
  { title: "Community Workshop", date: "Dec 22" },
  { title: "New Year Celebration", date: "Jan 1" }
];

export const Sidebar = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <TrendingUp className="w-5 h-5 mr-2 text-red-500" />
            Trending Stories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trendingStories.map((story, index) => (
              <div key={index} className="group cursor-pointer">
                <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                  {story.title}
                </h4>
                <p className="text-sm text-gray-500">{story.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Tag className="w-5 h-5 mr-2 text-blue-500" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between group cursor-pointer">
                <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Calendar className="w-5 h-5 mr-2 text-green-500" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="group cursor-pointer">
                <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                  {event.title}
                </h4>
                <p className="text-sm text-gray-500">{event.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
