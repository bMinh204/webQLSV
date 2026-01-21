const API_BASE_URL = 'http://localhost:5000/api';

// ============ AUTH API ============

export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    return response.json();
  },
};

// ============ USER API ============

export const userAPI = {
  // Get all users
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  // Get user by ID
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  // Create new user
  create: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create user');
    }
    return response.json();
  },

  // Update user
  update: async (id: string, userData: any) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  // Delete user
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return response.json();
  },
};

// ============ COURSE API ============

export const courseAPI = {
  // Get all courses
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/courses`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  },

  // Get course by ID
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`);
    if (!response.ok) throw new Error('Failed to fetch course');
    return response.json();
  },

  // Create new course
  create: async (courseData: any) => {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });
    if (!response.ok) throw new Error('Failed to create course');
    return response.json();
  },

  // Update course
  update: async (id: string, courseData: any) => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });
    if (!response.ok) throw new Error('Failed to update course');
    return response.json();
  },

  // Delete course
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete course');
    return response.json();
  },
};

// ============ GRADE API ============

export const gradeAPI = {
  // Get all grades
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/grades`);
    if (!response.ok) throw new Error('Failed to fetch grades');
    return response.json();
  },

  // Get grades by student ID
  getByStudent: async (studentId: string) => {
    const response = await fetch(`${API_BASE_URL}/grades/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch student grades');
    return response.json();
  },

  // Get grades by course ID
  getByCourse: async (courseId: string) => {
    const response = await fetch(`${API_BASE_URL}/grades/course/${courseId}`);
    if (!response.ok) throw new Error('Failed to fetch course grades');
    return response.json();
  },

  // Create new grade
  create: async (gradeData: any) => {
    const response = await fetch(`${API_BASE_URL}/grades`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gradeData),
    });
    if (!response.ok) throw new Error('Failed to create grade');
    return response.json();
  },

  // Update grade
  update: async (id: string, gradeData: any) => {
    const response = await fetch(`${API_BASE_URL}/grades/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gradeData),
    });
    if (!response.ok) throw new Error('Failed to update grade');
    return response.json();
  },

  // Delete grade
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/grades/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete grade');
    return response.json();
  },
};
