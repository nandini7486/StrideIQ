import { useCallback, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { useRules } from '@/context/RuleContext';
import { Sidebar } from '@/components/Sidebar';
import TestPanel from '@/components/TestPanel';
import { PolicyEngineLayout } from '@/components/PolicyEngineLayout';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import RuleEditor from '@/components/RuleEditor';
import type { Rule } from '@/types/rule';

export default function RulesPage() {
  const { rules, deleteRule, toggleRule, reorderRules } = useRules();
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleToggleRule = useCallback((id: string) => {
    toggleRule(id);
  }, [toggleRule]);

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    reorderRules(result.source.index, result.destination.index);
  }, [reorderRules]);

  const handleAddRule = useCallback(() => {
    setEditingRule(null);
    setIsEditorOpen(true);
  }, []);

  const handleEditRule = useCallback((id: string) => {
    const rule = rules.find(r => r.id === id);
    if (rule) {
      setEditingRule(rule);
      setIsEditorOpen(true);
    }
  }, [rules]);
  
  const handleEditorSave = useCallback(() => {
    setIsEditorOpen(false);
    setEditingRule(null);
  }, []);

  const handleDeleteRule = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      deleteRule(id);
    }
  }, [deleteRule]);

  const mainContent = (
    <div className="h-full flex flex-col">
      <div className="px-8 py-6 border-b border-[#E5E5E5]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-semibold text-gray-900">Policy Rules</h2>
            <p className="text-sm text-[#666666] mt-1">
              {rules.filter(r => r.active).length} active rules
            </p>
          </div>
          <Button 
            onClick={handleAddRule} 
            className="bg-black text-white hover:opacity-90 rounded-md px-3 py-2 text-sm font-medium"
          >
            + New Rule
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {rules.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed border-gray-200 rounded-lg">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <svg className="mx-auto" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12H15M12 9V15M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900">No rules yet</h3>
              <p className="mt-1 text-sm text-gray-500">Create your first rule to get started</p>
              <div className="mt-6">
                <Button 
                  onClick={handleAddRule} 
                  className="bg-black text-white hover:bg-gray-800 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  New Rule
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="rules">
                  {(provided) => (
                    <div 
                      {...provided.droppableProps} 
                      ref={provided.innerRef}
                      className="space-y-3"
                    >
                      {rules.map((rule, index) => (
                        <Draggable key={rule.id} draggableId={rule.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`relative group rounded border border-[#E5E5E5] bg-white hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-200 ${snapshot.isDragging ? 'shadow-lg' : ''} ${
                                !rule.active ? 'opacity-60' : ''
                              }`}
                            >
                              <div className="p-6">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start flex-1 min-w-0">
                                    <div 
                                      {...provided.dragHandleProps}
                                      className="flex items-center h-6 mr-3 text-gray-300 hover:text-gray-400 cursor-move"
                                      aria-label="Drag to reorder"
                                    >
                                      <GripVertical className="h-5 w-5" />
                                    </div>
                              
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                          <h3 className="text-base font-medium text-gray-900">{rule.name}</h3>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                          <button
                                            onClick={() => handleToggleRule(rule.id)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none ${
                                              rule.active ? 'bg-black' : 'bg-[#E5E5E5]'
                                            }`}
                                            aria-label={rule.active ? 'Deactivate rule' : 'Activate rule'}
                                          >
                                            <span
                                              className={`${
                                                rule.active ? 'translate-x-6' : 'translate-x-1'
                                              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200`}
                                            />
                                          </button>
                                          <div className="relative">
                                            <button className="p-1 text-[#999999] hover:text-[#666666]">
                                              ⋮
                                            </button>
                                            <div className="absolute right-0 mt-1 w-40 bg-white rounded border border-[#E5E5E5] shadow-[0_2px_4px_rgba(0,0,0,0.1)] py-1 z-10 hidden group-hover:block">
                                              <button
                                                onClick={() => handleEditRule(rule.id)}
                                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#F5F5F5]"
                                              >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                              </button>
                                              <button
                                                onClick={() => handleDeleteRule(rule.id)}
                                                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                              >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="mt-4 space-y-2">
                                        <div className="flex items-start">
                                          <span className="text-sm text-[#666666] font-medium w-12">IF</span> 
                                          <div className="text-sm text-gray-900">
                                            {rule.condition || 'No condition set'}
                                          </div>
                                        </div>
                                        <div className="flex items-start">
                                          <span className="text-sm text-[#666666] font-medium w-12">THEN</span> 
                                          <div className="text-sm text-gray-900">
                                            {rule.actions && rule.actions.length > 0 ? (
                                              rule.actions.map((action, idx) => (
                                                <span key={idx}>
                                                  {action.replace(/_/g, ' ')}
                                                  {idx < rule.actions.length - 1 && ', '}
                                                </span>
                                              ))
                                            ) : (
                                              <span className="text-gray-400">No actions</span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="mt-4 text-xs text-[#999999]">
                                        Priority: {index + 1}  •  Last edited: {rule.updatedAt ? formatDistanceToNow(new Date(rule.updatedAt), { addSuffix: true }) : 'Unknown'}
                                      </div>
                              </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}
        </div>
      </div>
  );

  return (
    <>
      <PolicyEngineLayout
        sidebar={<Sidebar />}
        mainContent={mainContent}
        testPanel={<TestPanel />}
      />
      <RuleEditor
        rule={editingRule}
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        onSave={handleEditorSave}
      />
    </>
  );
}