
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Save, Play, Trash2, Grid3X3 } from 'lucide-react';
import { BlockData } from '../types/gameTypes';
import { useGameStore } from '../store/gameStore';
import { useToast } from '@/hooks/use-toast';

const GRID_SIZE = 6;
const BLOCK_SIZE = 40;
const CELL_GAP = 2;

const LevelEditor: React.FC = () => {
  const { isLevelEditorOpen, toggleLevelEditor, addCustomLevel } = useGameStore();
  const { toast } = useToast();
  
  const [levelName, setLevelName] = useState('');
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [selectedBlockType, setSelectedBlockType] = useState<'horizontal' | 'vertical' | 'key'>('horizontal');
  const [isPlaying, setIsPlaying] = useState(false);

  const clearGrid = useCallback(() => {
    setBlocks([]);
  }, []);

  const addBlock = useCallback((x: number, y: number) => {
    if (isPlaying) return;

    // Check if position is occupied
    const occupied = blocks.some(block => 
      x >= block.x && x < block.x + block.width &&
      y >= block.y && y < block.y + block.height
    );

    if (occupied) return;

    const newBlock: BlockData = {
      id: `${selectedBlockType}-${Date.now()}`,
      x,
      y,
      width: selectedBlockType === 'vertical' ? 1 : 2,
      height: selectedBlockType === 'horizontal' ? 1 : selectedBlockType === 'key' ? 1 : 2,
      type: selectedBlockType
    };

    // Check boundaries
    if (newBlock.x + newBlock.width > GRID_SIZE || 
        newBlock.y + newBlock.height > GRID_SIZE) {
      return;
    }

    setBlocks(prev => [...prev, newBlock]);
  }, [blocks, selectedBlockType, isPlaying]);

  const removeBlock = useCallback((blockId: string) => {
    if (isPlaying) return;
    setBlocks(prev => prev.filter(block => block.id !== blockId));
  }, [isPlaying]);

  const saveLevel = useCallback(() => {
    if (!levelName.trim()) {
      toast({
        title: "Level name required",
        description: "Please enter a name for your level",
        variant: "destructive"
      });
      return;
    }

    const keyBlocks = blocks.filter(block => block.type === 'key');
    if (keyBlocks.length !== 1) {
      toast({
        title: "Invalid level",
        description: "Level must have exactly one key block",
        variant: "destructive"
      });
      return;
    }

    const newLevel = {
      id: `custom-${Date.now()}`,
      name: levelName,
      creator: { id: 'user', name: 'You' },
      blocks: blocks,
      difficulty: blocks.length < 5 ? 1 : blocks.length < 8 ? 2 : 3,
      likes: 0,
      plays: 0,
      isPublic: false
    };

    addCustomLevel(newLevel);
    
    toast({
      title: "Level saved!",
      description: `"${levelName}" has been saved to your custom levels`,
    });

    setLevelName('');
    setBlocks([]);
    toggleLevelEditor();
  }, [levelName, blocks, addCustomLevel, toggleLevelEditor, toast]);

  const testLevel = useCallback(() => {
    const keyBlocks = blocks.filter(block => block.type === 'key');
    if (keyBlocks.length !== 1) {
      toast({
        title: "Cannot test level",
        description: "Level must have exactly one key block",
        variant: "destructive"
      });
      return;
    }

    setIsPlaying(!isPlaying);
  }, [blocks, isPlaying, toast]);

  return (
    <Dialog open={isLevelEditorOpen} onOpenChange={toggleLevelEditor}>
      <DialogContent className="sm:max-w-4xl bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Grid3X3 className="text-blue-400" size={20} />
            Level Editor
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap gap-2 items-center">
            <Input
              placeholder="Level name..."
              value={levelName}
              onChange={(e) => setLevelName(e.target.value)}
              className="max-w-xs bg-gray-800 border-gray-600"
              disabled={isPlaying}
            />
            
            <div className="flex gap-1">
              {(['horizontal', 'vertical', 'key'] as const).map(type => (
                <Button
                  key={type}
                  variant={selectedBlockType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedBlockType(type)}
                  disabled={isPlaying}
                  className="capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>

            <div className="flex gap-1 ml-auto">
              <Button variant="outline" size="sm" onClick={testLevel}>
                <Play size={16} />
                {isPlaying ? 'Stop Test' : 'Test'}
              </Button>
              <Button variant="outline" size="sm" onClick={clearGrid} disabled={isPlaying}>
                <Trash2 size={16} />
                Clear
              </Button>
              <Button size="sm" onClick={saveLevel} disabled={isPlaying}>
                <Save size={16} />
                Save
              </Button>
            </div>
          </div>

          {/* Grid */}
          <div className="flex justify-center">
            <div 
              className="relative bg-gray-800 rounded-2xl border border-gray-600"
              style={{
                width: GRID_SIZE * BLOCK_SIZE + (GRID_SIZE + 1) * CELL_GAP,
                height: GRID_SIZE * BLOCK_SIZE + (GRID_SIZE + 1) * CELL_GAP,
                padding: CELL_GAP
              }}
            >
              {/* Grid cells */}
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                const x = index % GRID_SIZE;
                const y = Math.floor(index / GRID_SIZE);
                
                return (
                  <div
                    key={`cell-${x}-${y}`}
                    className="absolute bg-gray-700/50 rounded cursor-pointer hover:bg-gray-600/50 transition-colors"
                    style={{
                      left: x * (BLOCK_SIZE + CELL_GAP) + CELL_GAP,
                      top: y * (BLOCK_SIZE + CELL_GAP) + CELL_GAP,
                      width: BLOCK_SIZE,
                      height: BLOCK_SIZE,
                    }}
                    onClick={() => addBlock(x, y)}
                  />
                );
              })}

              {/* Blocks */}
              {blocks.map(block => (
                <motion.div
                  key={block.id}
                  className={`absolute rounded cursor-pointer ${
                    block.type === 'horizontal' ? 'bg-green-500' :
                    block.type === 'vertical' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`}
                  style={{
                    left: block.x * (BLOCK_SIZE + CELL_GAP) + CELL_GAP,
                    top: block.y * (BLOCK_SIZE + CELL_GAP) + CELL_GAP,
                    width: block.width * BLOCK_SIZE + (block.width - 1) * CELL_GAP,
                    height: block.height * BLOCK_SIZE + (block.height - 1) * CELL_GAP,
                  }}
                  onClick={() => removeBlock(block.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
                    {block.type === 'key' ? '🐹' : block.type[0].toUpperCase()}
                  </div>
                </motion.div>
              ))}

              {/* Exit */}
              <div 
                className="absolute bg-yellow-400 rounded-l flex items-center justify-center"
                style={{
                  right: -CELL_GAP,
                  top: 2 * BLOCK_SIZE + 3 * CELL_GAP,
                  width: CELL_GAP * 2,
                  height: BLOCK_SIZE,
                }}
              >
                🚪
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-2 justify-center">
            <Badge variant="outline">Blocks: {blocks.length}</Badge>
            <Badge variant="outline">Keys: {blocks.filter(b => b.type === 'key').length}</Badge>
            <Badge variant="outline">
              Difficulty: {blocks.length < 5 ? 'Easy' : blocks.length < 8 ? 'Medium' : 'Hard'}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LevelEditor;
