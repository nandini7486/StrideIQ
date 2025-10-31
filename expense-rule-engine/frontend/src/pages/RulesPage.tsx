import { useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import { Plus, Pencil, Trash2, MoreVertical } from 'lucide-react';
import { useRules } from '@/context/RuleContext';
import { Sidebar } from '@/components/Sidebar';
import { TestPanel } from '@/components/TestPanelNew';
import { PolicyEngineLayout } from '@/components/PolicyEngineLayout';

export default function RulesPage() {
  const { rules, deleteRule, toggleRule, reorderRules } = useRules();

  const handleToggleRule = useCallback((id: string) => {
    toggleRule(id);
  }, [toggleRule]);
  
  const handleDeleteRule = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      deleteRule(id);
    }
  }, [deleteRule]);
  
  const handleEditRule = useCallback((id: string) => {
    console.log('Edit rule:', id);
  }, []);
  
  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    
    reorderRules(result.source.index, result.destination.index);
  }, [reorderRules]);

  const handleAddRule = useCallback(() => {
    console.log('Add new rule');
  }, []);

  return (
    <PolicyEngineLayout
      sidebar={<Sidebar />}
      mainContent={
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold mb-1">Policy Rules</h2>
              <p className="text-sm text-neutral-500">
                {rules.filter(r => r.active).length} active rules
              </p>
            </div>
            <button
              onClick={handleAddRule}
              className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              New Rule
            </button>
          </div>

          {/* Rules List */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="rules">
              {(provided) => (
                <div 
                  {...provided.droppableProps} 
                  ref={provided.innerRef} 
                  className="space-y-3"
                >
                  {rules.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-neutral-200 rounded-lg">
                      <p className="text-neutral-500">No rules found. Create your first rule to get started.</p>
                      <button
                        onClick={handleAddRule}
                        className="mt-4 text-black font-medium hover:underline"
                      >
                        + Add Rule
                      </button>
                    </div>
                  ) : (
                    rules.map((rule, index) => (
                      <Draggable key={rule.id} draggableId={rule.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-white border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
                              snapshot.isDragging ? 'shadow-lg' : ''
                            } ${!rule.active ? 'opacity-60' : ''}`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3 flex-1">
                                <span 
                                  {...provided.dragHandleProps}
                                  className="text-neutral-400 cursor-move text-lg"
                                >
                                  ≡
                                </span>
                                <h3 className="font-semibold">{rule.name}</h3>
                              </div>
                              <div className="flex items-center gap-3">
                                {/* Toggle Switch */}
                                <button
                                  onClick={() => handleToggleRule(rule.id)}
                                  className={`relative w-11 h-6 rounded-full transition-colors ${
                                    rule.active ? 'bg-black' : 'bg-neutral-300'
                                  }`}
                                >
                                  <span 
                                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                      rule.active ? 'translate-x-5' : ''
                                    }`} 
                                  />
                                </button>
                                {/* More Options Menu */}
                                <button 
                                  className="text-neutral-400 hover:text-black"
                                  onClick={() => handleEditRule(rule.id)}
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="ml-8 space-y-2">
                              <p className="text-sm">
                                <span className="text-neutral-500">IF</span> {rule.condition}
                              </p>
                              <p className="text-sm">
                                <span className="text-neutral-500">THEN</span> {rule.actions.join(', ')}
                              </p>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      }
      testPanel={<TestPanel />}
    />
  );
}