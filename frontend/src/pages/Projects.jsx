import { useEffect, useState } from 'react';
import api from '../services/api';
import { 
    Box, 
    Typography, 
    Paper, 
    Button, 
    CircularProgress, 
    Alert, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { toast } from 'react-toastify';
import CreateProjectModal from '../components/CreateProjectModal';
import EditProjectModal from '../components/EditProjectModal';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [editProject, setEditProject] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, project: null });
    const [deleting, setDeleting] = useState(false);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data?.data?.projects || []);
        } catch (err) {
            setError('Unable to load projects');
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = async () => {
        if (!deleteDialog.project) return;
        
        setDeleting(true);
        try {
            await api.delete(`/projects/${deleteDialog.project.id}`);
            toast.success('Project deleted successfully');
            setDeleteDialog({ open: false, project: null });
            fetchProjects();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete project');
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f7f8fa">
            <Paper elevation={2} sx={{ p: 4, minWidth: 700, borderRadius: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5" fontWeight={600} color="primary.dark">
                        Projects
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => setShowCreate(true)}>
                        Create Project
                    </Button>
                </Box>
                {loading && <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {showCreate && (
                    <CreateProjectModal
                        onClose={() => setShowCreate(false)}
                        onCreated={fetchProjects}
                    />
                )}
                {editProject && (
                    <EditProjectModal
                        project={editProject}
                        onClose={() => setEditProject(null)}
                        onUpdated={fetchProjects}
                    />
                )}
                {!loading && !error && (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {projects.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">No projects found</TableCell>
                                    </TableRow>
                                ) : (
                                    projects.map((project) => (
                                        <TableRow key={project.id} hover>
                                            <TableCell>
                                                <a href={`/projects/${project.id}`} style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}>
                                                    {project.name}
                                                </a>
                                            </TableCell>
                                            <TableCell>{project.status}</TableCell>
                                            <TableCell>{project.description}</TableCell>
                                            <TableCell align="right">
                                                <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={() => setEditProject(project)}>
                                                    Edit
                                                </Button>
                                                <Button size="small" variant="text" href={`/projects/${project.id}`} sx={{ mr: 1 }}>View</Button>
                                                <Button 
                                                    size="small" 
                                                    variant="outlined" 
                                                    color="error"
                                                    onClick={() => setDeleteDialog({ open: true, project })}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={deleteDialog.open}
                    onClose={() => !deleting && setDeleteDialog({ open: false, project: null })}
                >
                    <DialogTitle>Delete Project</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete "{deleteDialog.project?.name}"? This will also delete all tasks in this project. This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialog({ open: false, project: null })} disabled={deleting}>
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteProject} color="error" disabled={deleting}>
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Box>
    );
};

export default Projects;