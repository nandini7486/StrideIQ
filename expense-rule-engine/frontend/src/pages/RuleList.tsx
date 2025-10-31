import { useCallback, useState } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  ListChecks,
  Search,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { useRules } from '@/context/RuleContext';
import type { Rule } from '@/types/rule';
import RuleEditor from '@/components/RuleEditor';
import TestPanel from '@/components/TestPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { DragDropContext, Draggable, Droppable, type DropResult } from 'react-beautiful-dnd';

export default function RuleList() {
  const { rules, deleteRule, toggleRule, reorderRules } = useRules();
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isTestPanelOpen, setIsTestPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');
  const [isLoading] = useState(false);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }

      if (result.destination.index === result.source.index) {
        return;
      }

      reorderRules(result.source.index, result.destination.index);
    },
    [reorderRules]
  );

  // Filter rules based on search and active tab
  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rule.condition.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'active') return matchesSearch && rule.active;
    if (activeTab === 'inactive') return matchesSearch && !rule.active;
    return matchesSearch;
  });

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Expense Rules</h1>
              <p className="text-muted-foreground">
                Automate your expense processing with custom rules
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => setIsTestPanelOpen(true)} 
                variant="outline"
                className="gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Test Rules
              </Button>
              <Button 
                onClick={() => {
                  setEditingRule(null);
                  setIsEditorOpen(true);
                }}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Rule
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search rules by name or condition..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Rules</CardTitle>
              <CardDescription className="text-2xl font-bold">{rules.length}</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
              <CardDescription className="text-2xl font-bold text-green-600">
                {rules.filter(r => r.active).length}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Last Updated</CardTitle>
              <CardDescription className="text-muted-foreground">
                {new Date().toLocaleDateString()}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs */}
        <div className="space-y-4">
          <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground max-w-md">
            <button
              onClick={() => setActiveTab('all')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2 ${
                activeTab === 'all' ? 'bg-background text-foreground shadow-sm' : ''
              }`}
            >
              <ListChecks className="h-4 w-4" />
              All
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2 ${
                activeTab === 'active' ? 'bg-background text-foreground shadow-sm' : ''
              }`}
            >
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Active
            </button>
            <button
              onClick={() => setActiveTab('inactive')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2 ${
                activeTab === 'inactive' ? 'bg-background text-foreground shadow-sm' : ''
              }`}
            >
              <XCircle className="h-4 w-4 text-muted-foreground" />
              Inactive
            </button>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-lg">
                    {activeTab === 'all' && 'All Rules'}
                    {activeTab === 'active' && 'Active Rules'}
                    {activeTab === 'inactive' && 'Inactive Rules'}
                  </CardTitle>
                  <CardDescription>
                    {filteredRules.length} {activeTab === 'all' ? 'rules' : activeTab} found
                  </CardDescription>
                </div>
                {activeTab === 'all' && (
                  <Badge variant="outline" className="px-3 py-1">
                    {rules.filter(r => r.active).length} active
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="space-y-4 p-6">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="rounded-lg border p-4">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-3 w-2/3" />
                          <Skeleton className="h-3 w-1/4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredRules.length === 0 ? (
                <div className="space-y-4 p-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <ListChecks className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">No rules found</h3>
                    <p className="text-sm text-muted-foreground">
                      {searchQuery 
                        ? 'No rules match your search. Try adjusting your search term.'
                        : activeTab === 'all'
                          ? 'Get started by creating your first rule to process expenses automatically.'
                          : activeTab === 'active'
                            ? 'No active rules. Enable a rule to see it here.'
                            : 'All rules are currently active.'}
                    </p>
                  </div>
                  {(!searchQuery && activeTab !== 'inactive') && (
                    <Button 
                      onClick={() => {
                        setEditingRule(null);
                        setIsEditorOpen(true);
                      }}
                      className="mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Rule
                    </Button>
                  )}
                </div>
              ) : (
                <div className="h-[calc(100vh-500px)] p-4">
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="rules">
                      {(provided) => (
                        <div 
                          {...provided.droppableProps} 
                          ref={provided.innerRef} 
                          className="space-y-3 h-full"
                        >
                          <ScrollArea className="h-full">
                            {filteredRules.map((rule, index) => (
                              <Draggable 
                                key={rule.id} 
                                draggableId={rule.id} 
                                index={index}
                              >
                                {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`group relative overflow-hidden rounded-lg border bg-card transition-all ${
                                    snapshot.isDragging ? 'shadow-lg' : 'hover:shadow-sm'
                                  } ${
                                    !rule.active ? 'opacity-60' : 'hover:border-primary/20'
                                  }`}
                                  style={{
                                    ...provided.draggableProps.style,
                                    // Add any additional styles here if needed
                                  }}
                                >
                                  <div className="flex items-start p-4">
                                    <div 
                                      {...provided.dragHandleProps}
                                      className="cursor-grab active:cursor-grabbing p-2 mr-2"
                                    >
                                      <div className="w-4 h-4 text-muted-foreground">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                          <path d="M12 5v14M5 12h14" />
                                        </svg>
                                      </div>
                                    </div>
                                    
                                    <div className="flex-1">
                                      <div className="flex justify-between items-center">
                                        <h3 className="font-medium">{rule.name}</h3>
                                        <div className="flex items-center space-x-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                            onClick={() => toggleRule(rule.id)}
                                            title={rule.active ? 'Disable rule' : 'Enable rule'}
                                          >
                                            {rule.active ? (
                                              <ToggleRight className="h-4 w-4 text-green-500" />
                                            ) : (
                                              <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                                            )}
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                            onClick={() => {
                                              setEditingRule(rule);
                                              setIsEditorOpen(true);
                                            }}
                                            title="Edit rule"
                                          >
                                            <Pencil className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-destructive/70 hover:text-destructive"
                                            onClick={() => {
                                              if (confirm('Are you sure you want to delete this rule?')) {
                                                deleteRule(rule.id);
                                              }
                                            }}
                                            title="Delete rule"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                      
                                      <div className="mt-3">
                                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                                          <span className="font-medium mr-2">Condition:</span>
                                          <code className="relative rounded bg-muted px-2 py-1 font-mono text-xs font-medium">
                                            {rule.condition}
                                          </code>
                                        </div>
                                        
                                        {rule.actions?.length > 0 && (
                                          <div className="mt-2">
                                            <div className="text-sm text-muted-foreground font-medium mb-1">Actions:</div>
                                            <div className="flex flex-wrap gap-2">
                                              {rule.actions.map((action, i) => (
                                                <Badge 
                                                  key={i} 
                                                  variant="secondary" 
                                                  className="font-normal text-xs py-1 px-2.5"
                                                >
                                                  {action}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground flex justify-between items-center border-t">
                                    <span>Last updated: {new Date(rule.updatedAt || new Date()).toLocaleDateString()}</span>
                                    <span className="text-xs">Priority: {index + 1}</span>
                                  </div>
                                </div>
                              )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </ScrollArea>
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Rule Editor Dialog */}
        <RuleEditor
          rule={editingRule}
          open={isEditorOpen}
          onOpenChange={(open) => {
            setIsEditorOpen(open);
            if (!open) setEditingRule(null);
          }}
          onSave={() => {
            setIsEditorOpen(false);
            setEditingRule(null);
          }}
        />
        
        {/* Test Panel */}
        <TestPanel 
          open={isTestPanelOpen} 
          onOpenChange={setIsTestPanelOpen}
        />
      </div>
    </div>
  );
}