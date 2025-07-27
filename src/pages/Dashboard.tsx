import { BarChart3, FileText, Share2, Tag, Plus, TrendingUp, Bell, Users, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Sample shared notes data
const sharedNotes = [
  {
    id: 1,
    title: "Team Project Guidelines",
    sharedBy: "Sarah Johnson",
    sharedWith: ["you", "mike.wilson", "lisa.chen"],
    permission: "read-write",
    lastModified: "2 hours ago",
    tags: ["team", "guidelines", "project"]
  },
  {
    id: 2,
    title: "Meeting Minutes - Q4 Planning",
    sharedBy: "John Doe",
    sharedWith: ["you", "sarah.johnson", "mike.wilson"],
    permission: "read-only",
    lastModified: "5 hours ago",
    tags: ["meeting", "planning", "q4"]
  },
  {
    id: 3,
    title: "Research Documentation",
    sharedBy: "Mike Wilson",
    sharedWith: ["you", "team"],
    permission: "read-write",
    lastModified: "1 day ago",
    tags: ["research", "documentation"]
  }
];

// Sample notifications data
const notifications = [
  {
    id: 1,
    type: "shared",
    title: "New note shared with you",
    message: "Sarah Johnson shared 'Team Project Guidelines' with you",
    time: "2 hours ago",
    unread: true
  },
  {
    id: 2,
    type: "comment",
    title: "New comment on your note",
    message: "Mike Wilson commented on 'Research Documentation'",
    time: "4 hours ago",
    unread: true
  },
  {
    id: 3,
    type: "update",
    title: "Shared note updated",
    message: "John Doe updated 'Meeting Minutes - Q4 Planning'",
    time: "6 hours ago",
    unread: false
  },
  {
    id: 4,
    type: "permission",
    title: "Permission changed",
    message: "Lisa Chen gave you write access to 'Budget Planning'",
    time: "1 day ago",
    unread: false
  }
];

const statsCards = [
  {
    title: "My Notes",
    value: "124",
    change: "+12%",
    icon: FileText,
    color: "text-primary"
  },
  {
    title: "Shared with Me",
    value: sharedNotes.length.toString(),
    change: "+2 new",
    icon: Share2,
    color: "text-secondary"
  },
  {
    title: "Notifications",
    value: notifications.filter(n => n.unread).length.toString(),
    change: "unread",
    icon: Bell,
    color: "text-accent"
  },
  {
    title: "Active Collaborators",
    value: "8",
    change: "+1 this week",
    icon: Users,
    color: "text-primary"
  }
];

const recentActivity = [
  { action: "Created", note: "Project Planning Notes", time: "2 hours ago", type: "created" },
  { action: "Shared", note: "Meeting Minutes", time: "4 hours ago", type: "shared" },
  { action: "Updated", note: "Research Document", time: "Yesterday", type: "updated" },
  { action: "Commented", note: "Team Guidelines", time: "2 days ago", type: "commented" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const unreadNotifications = notifications.filter(n => n.unread);

  const handleCreateNote = () => {
    navigate('/notes?action=create');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'shared': return <Share2 className="h-4 w-4 text-primary" />;
      case 'comment': return <FileText className="h-4 w-4 text-secondary" />;
      case 'update': return <TrendingUp className="h-4 w-4 text-accent" />;
      case 'permission': return <Users className="h-4 w-4 text-orange-500" />;
      default: return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'created': return 'bg-accent';
      case 'shared': return 'bg-primary';
      case 'updated': return 'bg-secondary';
      case 'commented': return 'bg-orange-500';
      default: return 'bg-muted-foreground';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your notes today.</p>
        </div>
        <div className="flex gap-3">
          {unreadNotifications.length > 0 && (
            <Button variant="outline" className="relative" onClick={() => navigate('/notifications')}>
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              {unreadNotifications.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {unreadNotifications.length}
                </Badge>
              )}
            </Button>
          )}
          <Button className="shadow-glow" onClick={handleCreateNote}>
            <Plus className="h-4 w-4 mr-2" />
            Create Note
          </Button>
        </div>
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
                <span className="text-accent font-medium">{stat.change}</span> 
                {stat.title !== "Notifications" && " from last month"}
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
                Ready to collaborate?
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                You have <span className="font-semibold text-accent">{sharedNotes.length} shared notes</span> and <span className="font-semibold text-primary">124 personal notes</span>
              </p>
              <div className="flex gap-3">
                <Button size="lg" className="shadow-glow" onClick={handleCreateNote}>
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Note
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/shared')}>
                  <Share2 className="h-5 w-5 mr-2" />
                  View Shared
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-gradient-to-br from-primary via-secondary to-accent rounded-full opacity-20"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <FileText className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">View All Notes</div>
                  <div className="text-xs opacity-75">Browse and manage notes</div>
                </div>
              </Button>
              <Button variant="outline" className="h-14 justify-start hover-lift" onClick={() => navigate('/shared')}>
                <Share2 className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Shared Notes</div>
                  <div className="text-xs opacity-75">Collaborate with others</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Shared Notes */}
        <Card className="glass hover-lift transition-smooth">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                Shared with Me
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/shared')}>
                View All
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              Recent notes shared by your team
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sharedNotes.slice(0, 3).map((note) => (
                <div key={note.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors border border-border/30">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {note.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      by {note.sharedBy} • {note.permission}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{note.lastModified}</p>
                  </div>
                  <Badge variant={note.permission === 'read-write' ? 'default' : 'secondary'} className="text-xs">
                    {note.permission === 'read-write' ? 'Edit' : 'View'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity & Notifications */}
        <Card className="glass hover-lift transition-smooth">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
                {unreadNotifications.length > 0 && (
                  <Badge className="h-5 text-xs">
                    {unreadNotifications.length}
                  </Badge>
                )}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/notifications')}>
                View All
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              Recent updates and activity
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(showAllNotifications ? notifications : notifications.slice(0, 4)).map((notification) => (
                <div key={notification.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                  notification.unread 
                    ? 'bg-primary/5 border-primary/20 hover:bg-primary/10' 
                    : 'bg-muted/20 border-border/30 hover:bg-muted/30'
                }`}>
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}