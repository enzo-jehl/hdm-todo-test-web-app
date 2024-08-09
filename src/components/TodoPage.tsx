/**
 * @todo YOU HAVE TO IMPLEMENT THE DELETE AND SAVE TASK ENDPOINT, A TASK CANNOT BE UPDATED IF THE TASK NAME DID NOT CHANGE, YOU'VE TO CONTROL THE BUTTON STATE ACCORDINGLY
 */
import { Check, Delete } from '@mui/icons-material';
import {
  Box, Button, Container, IconButton, TextField, Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.ts';
import { Task } from '../index';

const TodoPage = () => {
  const api = useFetch();
  const [ tasks, setTasks ] = useState<Task[]>([]);
  const [ taskName, setTaskName ] = useState<string>('');
  const [ selectedTaskId, setSelectedTaskId ] = useState<number | null>(null);

  const handleFetchTasks = async () => setTasks(await api.get('/tasks'));

  const handleDelete = async (id: number) => {
    // done
    await api.delete(`/tasks/${id}`);
    await handleFetchTasks();
  };

  const handleSave = async () => {
    // done
    if (selectedTaskId) {
      await api.patch(`/tasks/${selectedTaskId}`, { name: taskName });
    } else {
      await api.post('/tasks', { name: taskName });
    }
    await handleFetchTasks();
    setTaskName('');
    setSelectedTaskId(null);
  };

  useEffect(() => {
    (async () => {
      await handleFetchTasks();
    })();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h2">HDM Todo List</Typography>
      </Box>

      <Box justifyContent="center" mt={5} flexDirection="column">
        {
          tasks.map((task) => (
            <Box key={task.id} display="flex" justifyContent="center" alignItems="center" mt={2} gap={1} width="100%">
              <TextField
                size="small"
                value={selectedTaskId === task.id ? taskName : task.name}
                onChange={(e) => {
                  setTaskName(e.target.value);
                  setSelectedTaskId(task.id);
                }}
                fullWidth
                sx={{ maxWidth: 350 }}
              />
              <Box>
                <IconButton color="success" disabled={selectedTaskId !== task.id || taskName === task.name} onClick={handleSave}>
                  <Check />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(task.id)}>
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))
        }

        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <TextField
            size="small"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            fullWidth
            sx={{ maxWidth: 350 }}
            placeholder="Ajouter une nouvelle tâche"
          />
          <Button variant="outlined" onClick={handleSave} disabled={!taskName || selectedTaskId !== null}>Ajouter une tâche</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TodoPage;
