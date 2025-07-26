import { BarChart3, FileText, Share2, Tag, Plus, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statsCards = [
  {
    title: "Total Notes",
    value: "124",
    change: "+12%",
    icon: FileText,
    color: "text-primary"
  },
  {
    title: "Notes This Week",
    value: "8",
    change: "+25%",
    icon: TrendingUp,
    color: "text-secondary"
  },
  {
    title: "Shared Notes",
    value: "16",
    change: "+3%",
    icon: Share2,
    color: "text-accent"
  },
  {
    title: "Most Used Tag",
    value: "Work",
    change: "42 uses",
    icon: Tag,
    color: "text-primary"
  }
];

const recentActivity = [
  { action: "Created", note: "Project Planning Notes", time: "2 hours ago" },
  { action: "Shared", note: "Meeting Minutes", time: "4 hours ago" },
  { action: "Updated", note: "Research Document", time: "Yesterday" },
  { action: "Created", note: "Ideas & Brainstorming", time: "2 days ago" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const handleCreateNote = () => {
    navigate('/notes?action=create');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your notes today.</p>
        </div>
        <Button className="shadow-glow" onClick={handleCreateNote}>
          <Plus className="h-4 w-4 mr-2" />
          Create Note
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={stat.title} className="glass hover-lift transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-accent font-medium">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Hero Section */}
      <Card className="glass hover-lift transition-smooth bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-primary/20 mb-6">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Ready to create something amazing?
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                You have <span className="font-semibold text-accent">12 notes</span> and counting
              </p>
              <Button size="lg" className="shadow-glow" onClick={handleCreateNote}>
                <Plus className="h-5 w-5 mr-2" />
                Create Your Next Note
              </Button>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-gradient-to-br from-primary via-secondary to-accent rounded-full opacity-20"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="glass hover-lift transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart3 className="h-6 w-6 text-primary" />
              Quick Actions
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Jump into your most common tasks
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Button className="h-14 justify-start shadow-glow group" onClick={handleCreateNote}>
                <FileText className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-medium">Create New Note</div>
                  <div className="text-xs opacity-75">Start writing immediately</div>
                </div>
              </Button>
              <Button variant="outline" className="h-14 justify-start hover-lift" onClick={() => navigate('/notes')}>
                <Share2 className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">View All Notes</div>
                  <div className="text-xs opacity-75">Browse and manage notes</div>
                </div>
              </Button>
              <Button variant="outline" className="h-14 justify-start hover-lift" onClick={() => navigate('/shared')}>
                <Tag className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Shared Notes</div>
                  <div className="text-xs opacity-75">Collaborate with others</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass hover-lift transition-smooth">
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <p className="text-muted-foreground text-sm">
              Your latest note activities
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors border border-border/30">
                  <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                    activity.action === 'Created' ? 'bg-accent' :
                    activity.action === 'Shared' ? 'bg-primary' : 'bg-secondary'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      <span className="text-accent">{activity.action}</span> "{activity.note}"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 text-sm" onClick={() => navigate('/notes')}>
              View All Notes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}