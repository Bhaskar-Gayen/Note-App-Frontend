import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Grid3X3, List, Filter, SortAsc, Plus, Edit, Share, Eye } from "lucide-react";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Sample notes data
const sampleNotes = [
  {
    id: 1,
    title: "Project Planning & Strategy",
    content: "<h2>Q4 Goals and Strategic Initiatives</h2><p>This quarter we're focusing on expanding our market reach and improving customer satisfaction. Key objectives include:</p><ul><li>Launch new product features</li><li>Improve customer support response time</li><li>Expand into new markets</li></ul><p>We'll need to coordinate closely with all departments to ensure success.</p>",
    preview: "Q4 goals and strategic initiatives for the upcoming quarter...",
    tags: ["work", "planning", "strategy"],
    updatedAt: "2 hours ago",
    isShared: true
  },
  {
    id: 2,
    title: "Meeting Notes - Team Sync",
    content: "<h2>Weekly Team Sync - March 15</h2><p><strong>Attendees:</strong> John, Sarah, Mike, Lisa</p><h3>Agenda Items:</h3><ol><li>Sprint progress review</li><li>Blockers discussion</li><li>Upcoming deadlines</li></ol><p><strong>Action Items:</strong></p><ul><li>John to fix the authentication bug by Friday</li><li>Sarah to prepare presentation for client meeting</li></ul>",
    preview: "Discussed current sprint progress, blockers, and next steps...",
    tags: ["meetings", "team", "sync"],
    updatedAt: "5 hours ago",
    isShared: false
  },
  {
    id: 3,
    title: "Research: User Experience Trends",
    content: "<h2>Latest UX Trends 2024</h2><p>Research on current user experience trends and their impact on web design:</p><h3>Key Findings:</h3><ul><li><strong>Dark Mode:</strong> 80% of users prefer dark mode for better eye comfort</li><li><strong>Micro-interactions:</strong> Small animations improve user engagement by 35%</li><li><strong>Voice UI:</strong> Growing adoption in mobile applications</li></ul><p>These trends should influence our upcoming design decisions.</p>",
    preview: "Latest UX trends and best practices for modern web applications...",
    tags: ["research", "ux", "design"],
    updatedAt: "1 day ago",
    isShared: true
  },
  {
    id: 4,
    title: "Personal Learning Goals",
    content: "<h2>Learning Objectives - 2024</h2><p>Personal development plan for the next 6 months:</p><h3>Technical Skills:</h3><ul><li>Advanced React patterns</li><li>GraphQL and Apollo</li><li>Cloud architecture (AWS)</li></ul><h3>Courses to Take:</h3><ul><li>Advanced TypeScript</li><li>System Design</li><li>Leadership fundamentals</li></ul>",
    preview: "Skills to develop and courses to take in the next 6 months...",
    tags: ["personal", "learning", "goals"],
    updatedAt: "2 days ago",
    isShared: false
  },
  {
    id: 5,
    title: "Ideas & Brainstorming",
    content: "<h2>Creative Ideas Collection</h2><p>Random thoughts and creative ideas for future projects:</p><h3>App Ideas:</h3><ul><li>Recipe sharing platform with AR features</li><li>Collaborative playlist generator</li><li>Virtual study room application</li></ul><h3>Business Ideas:</h3><ul><li>Sustainable packaging solutions</li><li>Local artist marketplace</li></ul>",
    preview: "Random thoughts and creative ideas for future projects...",
    tags: ["ideas", "creative", "brainstorming"],
    updatedAt: "3 days ago",
    isShared: false
  },
  {
    id: 6,
    title: "Technical Documentation",
    content: "<h2>API Documentation - User Service</h2><h3>Authentication Endpoints:</h3><pre><code>POST /api/auth/login\nPOST /api/auth/register\nPOST /api/auth/refresh</code></pre><h3>User Management:</h3><pre><code>GET /api/users/:id\nPUT /api/users/:id\nDELETE /api/users/:id</code></pre><p>All endpoints require proper authentication headers.</p>",
    preview: "API documentation and technical specifications for the new...",
    tags: ["technical", "documentation", "api"],
    updatedAt: "1 week ago",
    isShared: true
  }
];

const tagColors = {
  work: "bg-primary/10 text-primary border-primary/20",
  planning: "bg-secondary/10 text-secondary border-secondary/20",
  strategy: "bg-accent/10 text-accent border-accent/20",
  meetings: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  team: "bg-green-500/10 text-green-500 border-green-500/20",
  sync: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  research: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  ux: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  design: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  personal: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  learning: "bg-teal-500/10 text-teal-500 border-teal-500/20",
  goals: "bg-red-500/10 text-red-500 border-red-500/20",
  ideas: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  creative: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  brainstorming: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  technical: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  documentation: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  api: "bg-lime-500/10 text-lime-500 border-lime-500/20"
};

export default function Notes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("updated");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [notes, setNotes] = useState(sampleNotes);

  // Check URL parameters on component mount
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'create') {
      handleCreateNote();
      // Remove the parameter from URL
      setSearchParams(new URLSearchParams());
    }
  }, [searchParams, setSearchParams]);

  const handleSaveNote = (noteData: { title: string; content: string; tags: string[] }) => {
    if (editingNote) {
      // Update existing note
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === editingNote.id 
            ? {
                ...note,
                title: noteData.title,
                content: noteData.content,
                preview: noteData.content.replace(/<[^>]*>/g, '').substring(0, 100) + "...",
                tags: noteData.tags,
                updatedAt: "Just now"
              }
            : note
        )
      );
      setEditingNote(null);
    } else {
      // Create new note
      const newNote = {
        id: notes.length + 1,
        title: noteData.title,
        content: noteData.content,
        preview: noteData.content.replace(/<[^>]*>/g, '').substring(0, 100) + "...",
        tags: noteData.tags,
        updatedAt: "Just now",
        isShared: false
      };
      setNotes([newNote, ...notes]);
    }
  };

  const handleViewNote = (note: any) => {
    setSelectedNote(note);
    setIsViewerOpen(true);
  };

  const handleEditNote = (note: any) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterBy === "all") return matchesSearch;
    if (filterBy === "shared") return matchesSearch && note.isShared;
    if (filterBy === "private") return matchesSearch && !note.isShared;
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">My Notes</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your notes
          </p>
        </div>
        <Button 
          className="shadow-glow"
          onClick={handleCreateNote}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Note
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="glass rounded-lg p-4 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass border-border/30 focus:border-primary/50"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-32 glass border-border/30">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass border-border/30">
                <SelectItem value="all">All Notes</SelectItem>
                <SelectItem value="shared">Shared</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 glass border-border/30">
                <SortAsc className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass border-border/30">
                <SelectItem value="updated">Updated</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-1 bg-muted/30 rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Notes Grid/List */}
      <div className={`${
        viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
      }`}>
        {filteredNotes.map((note) => (
          <Card key={note.id} className="glass hover-lift transition-smooth group relative">
            {/* Action Buttons */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 bg-background/80 hover:bg-background"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewNote(note);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 bg-background/80 hover:bg-background"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditNote(note);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              {note.isShared && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 bg-background/80 hover:bg-background"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle share functionality
                  }}
                >
                  <Share className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="cursor-pointer" onClick={() => handleViewNote(note)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between pr-12">
                  <CardTitle className="text-lg font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {note.title}
                  </CardTitle>
                  {note.isShared && (
                    <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {note.preview}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-1 rounded-md text-xs font-medium border ${
                        tagColors[tag as keyof typeof tagColors] || "bg-muted/50 text-muted-foreground border-muted"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Updated {note.updatedAt}</span>
                  <span>{note.isShared ? "Shared" : "Private"}</span>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No notes found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filters
          </p>
          <Button variant="outline">Clear filters</Button>
        </div>
      )}

      {/* Note Editor */}
      <NoteEditor
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
        note={editingNote}
      />

      {/* Note Viewer Dialog */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-semibold">
                {selectedNote?.title}
              </DialogTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsViewerOpen(false);
                    handleEditNote(selectedNote);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                {selectedNote?.isShared && (
                  <Button size="sm" variant="outline">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>
          <div className="mt-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedNote?.tags.map((tag: string) => (
                <span
                  key={tag}
                  className={`px-2 py-1 rounded-md text-xs font-medium border ${
                    tagColors[tag as keyof typeof tagColors] || "bg-muted/50 text-muted-foreground border-muted"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div 
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: selectedNote?.content || '' }}
            />
            <div className="mt-6 pt-4 border-t text-sm text-muted-foreground">
              <p>Last updated {selectedNote?.updatedAt} • {selectedNote?.isShared ? "Shared" : "Private"}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}