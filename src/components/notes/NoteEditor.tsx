import { useState, useEffect } from "react";
import { X, Save, Tag, Bold, Italic, List, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface NoteEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: { title: string; content: string; tags: string[] }) => void;
  note?: {
    id: number;
    title: string;
    content: string;
    tags: string[];
  } | null;
}

export function NoteEditor({ isOpen, onClose, onSave, note }: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isRichText, setIsRichText] = useState(false);

  // Load note data when editing
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
      setIsRichText(note.content.includes('<'));
    } else {
      // Reset form for new note
      setTitle("");
      setContent("");
      setTags([]);
      setNewTag("");
      setIsRichText(false);
    }
  }, [note, isOpen]);

  const handleSave = () => {
    if (!title.trim()) return;

    const processedContent = isRichText ? content : `<p>${content.replace(/\n/g, '</p><p>')}</p>`;
    
    onSave({
      title: title.trim(),
      content: processedContent,
      tags: tags
    });

    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase())) {
      setTags([...tags, newTag.trim().toLowerCase()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const insertFormatting = (format: string) => {
    const textarea = document.getElementById('note-content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let replacement = '';
    switch (format) {
      case 'bold':
        replacement = `<strong>${selectedText || 'Bold text'}</strong>`;
        break;
      case 'italic':
        replacement = `<em>${selectedText || 'Italic text'}</em>`;
        break;
      case 'list':
        replacement = `<ul><li>${selectedText || 'List item'}</li></ul>`;
        break;
      case 'heading':
        replacement = `<h2>${selectedText || 'Heading'}</h2>`;
        break;
      default:
        replacement = selectedText;
    }

    const newContent = 
      textarea.value.substring(0, start) + 
      replacement + 
      textarea.value.substring(end);
    
    setContent(newContent);
    setIsRichText(true);
    
    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {note ? 'Edit Note' : 'Create New Note'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-6 overflow-y-auto">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="note-title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="note-title"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1 px-2 py-1"
                >
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleTagKeyPress}
                className="flex-1"
              />
              <Button onClick={addTag} variant="outline" size="sm">
                <Tag className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="note-content" className="text-sm font-medium">
                Content
              </Label>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => insertFormatting('bold')}
                  className="h-8 w-8 p-0"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => insertFormatting('italic')}
                  className="h-8 w-8 p-0"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => insertFormatting('heading')}
                  className="h-8 w-8 p-0"
                >
                  <Type className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => insertFormatting('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Textarea
              id="note-content"
              placeholder="Start writing your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
            {isRichText && (
              <p className="text-xs text-muted-foreground">
                Rich text formatting detected. HTML tags will be rendered in the preview.
              </p>
            )}
          </div>

          {/* Preview */}
          {content && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Preview</Label>
              <div className="border rounded-lg p-4 bg-muted/30 max-h-60 overflow-y-auto">
                <div 
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ 
                    __html: isRichText ? content : `<p>${content.replace(/\n/g, '</p><p>')}</p>`
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {note ? 'Editing existing note' : 'Creating new note'}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim()}>
              <Save className="h-4 w-4 mr-2" />
              {note ? 'Update Note' : 'Save Note'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}