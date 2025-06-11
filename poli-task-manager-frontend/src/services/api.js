// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// ---------------- USERS ----------------
export const getUsers = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/users`);
    return res.data;
  } catch (err) {
    console.error("Error en getUsers:", err);
    return [];
  }
};

export const getUserById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/api/users/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error en getUserById(${id}):`, err);
    return null;
  }
};

export const register = async (name, email, password) => {
  try {
    const res = await axios.post(`${API_URL}/api/auth/register`, {
      name,
      email,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Guarda el token en localStorage
    localStorage.setItem('token', res.data.token);

    return { success: true, user: res.data };
  } catch (err) {
    console.error("Error en register:", err);
    return { success: false, message: err.response?.data || 'Error en el registro' };
  }
};

export const login = async (email, password) => {
  try {
    const res = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password
    });

    // Guarda el token en localStorage
    localStorage.setItem('token', res.data.token);

    return { success: true, user: res.data };
  } catch (err) {
    console.error("Error en login:", err);
    return { success: false, message: err.response?.data || 'Credenciales inválidas' };
  }
};


// ---------------- PROJECTS ----------------
export const getProjects = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/projects`);
    return res.data;
  } catch (err) {
    console.error("Error en getProjects:", err);
    return [];
  }
};

export const getProjectById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/api/projects/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error en getProjectById(${id}):`, err);
    return null;
  }
};

export const createProject = async (project) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) throw new Error('Usuario no autenticado');

    const res = await axios.post(`${API_URL}/api/projects`, project, {
      headers: {
        'Authorization': `Bearer ${token}`, // <-- Asegúrate que esto esté
        'Content-Type': 'application/json'
      }
    });

    return { success: true, project: res.data };
  } catch (err) {
    console.error("Error en createProject:", err);
    return { success: false, message: err.response?.data || 'Error al crear el proyecto' };
  }
};


// ---------------- TASKS ----------------
export const getAllTasks = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/tasks`);
    return res.data;
  } catch (err) {
    console.error("Error en getAllTasks:", err);
    return [];
  }
};

export const getTaskById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/api/tasks/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error en getTaskById(${id}):`, err);
    return null;
  }
};

export const getTasksByProjectId = async (projectId) => {
  try {
    const res = await axios.get(`${API_URL}/api/tasks/project/${projectId}`);
    return res.data;
  } catch (err) {
    console.error(`Error en getTasksByProjectId(${projectId}):`, err);
    return [];
  }
};



export const createTask = async (task) => {
  try {
    const res = await axios.post(`${API_URL}/api/tasks`, task, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return res.data;
  } catch (err) {
    console.error("Error en createTask:", err);
    return null;
  }
};





export const updateTask = async (taskId, updates) => {
  try {
    const res = await axios.put(`${API_URL}/api/tasks/${taskId}`, updates);
    return res.data;
  } catch (err) {
    console.error(`Error en updateTask(${taskId}):`, err);
    return null;
  }
};

// ---------------- COMMENTS ----------------
export const getCommentsByTaskId = async (taskId) => {
  try {
    const res = await axios.get(`${API_URL}/api/comments/task/${taskId}`);
    return res.data;
  } catch (err) {
    console.error(`Error en getCommentsByTaskId(${taskId}):`, err);
    return [];
  }
};

export const createComment = async (comment) => {
  try {
    const res = await axios.post(`${API_URL}/api/comments`, comment);
    return res.data;
  } catch (err) {
    console.error("Error en createComment:", err);
    return null;
  }
};

// ---------------- PROJECT USERS ----------------
export const getProjectUsers = async (projectId) => {
  try {
    const res = await axios.get(`${API_URL}/api/project-users/${projectId}`);
    return res.data;
  } catch (err) {
    console.error(`Error en getProjectUsers(${projectId}):`, err);
    return [];
  }
};

// ---------------- BUSQUEDA ----------------
export const searchAll = async (query) => {
  try {
    const res = await axios.get(`${API_URL}/api/search?q=${query}`);
    return res.data;
  } catch (err) {
    console.error(`Error en searchAll(${query}):`, err);
    return [];
  }
};
