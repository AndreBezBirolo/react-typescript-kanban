import React, { useEffect, useState } from 'react';
import './App.css';
import { IColumn, ITask, ITaskBase } from "./interfaces/interfaces";
import { Board } from './components/Board/Board';
import { Button } from "react-bootstrap";
import { TaskForm } from "./components/TaskForm/TaskForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import ErrorToast from "./components/Toasts/ErrorToast";
import LoginForm from "./components/LoginForm/LoginForm";
import { setupJWT } from './Middleware/AuthMiddleware';
import UserService from "./services/UserService";
import TaskService from "./services/TaskService";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [columns, setColumns] = useState<IColumn[]>([
        {
            key: 'todo',
            title: 'To do',
            tasks: [],
        },
        {
            key: 'doing',
            title: 'Doing',
            tasks: [],
        },
        {
            key: 'ready',
            title: 'Ready',
            tasks: [],
        },
    ])
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [showForm, setShowForm] = useState
    (false);
    const [filter, setFilter] = useState<string | null>(null);
    const [sort, setSort] = useState<string | null>(null);
    const [search, setSearch] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchTasks = async (): Promise<void> => {
        try {
            const tasks = await TaskService.fetchTasks(filter, search, sort);
            setTasks(tasks);
        } catch (errorMessage) {
            handleShowError(errorMessage as string);
        }
    }

    const postTask = async (taskData: ITaskBase): Promise<void> => {
        try {
            await TaskService.postTask(taskData);
        } catch (errorMessage) {
            handleShowError(errorMessage as string);
        }
    }

    const patchTask = async (taskId: number, updatedStatus: string): Promise<void> => {
        try {
            await TaskService.patchTask(taskId, updatedStatus);
        } catch (errorMessage) {
            handleShowError(errorMessage as string);
        }
    }

    const handleShowError = (message: string) => {
        setErrorMessage(message);
        setShowError(true);
    };

    const handleCloseError = () => {
        setShowError(false);
    };

    const handleFormSubmit = async (taskData: ITaskBase) => {
        await postTask(taskData);
        await fetchTasks();
        setFilter(null);
        setSort(null);
        setSearch(null);
        setShowForm(false);
    };

    const handleTaskMove = async (taskId: number, updatedStatus: string) => {
        await patchTask(taskId, updatedStatus);
    };

    const handleAddTaskClick = () => {
        setShowForm(true);
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        UserService.logout();
    };

    useEffect(() => {
        setupJWT();
    }, []);

    useEffect(() => {
        const token = UserService.getToken();
        setIsLoggedIn(!!token);
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            fetchTasks();
        }
    }, [filter, sort, search, isLoggedIn]);

    useEffect(() => {
        if (isLoggedIn) {
            const newColumns = columns.map((column) => ({
                ...column,
                tasks: tasks.filter((task) => task.status.replace(/\s/g, '').toLowerCase() === column.key),
            }));
            setColumns(newColumns);
        }

    }, [tasks, isLoggedIn]);

    return (
        <div className="App">
            <header>
                <div className="header-content">
                    <h1>Online Kanban Board</h1>
                    {isLoggedIn ? <a onClick={handleLogout} className="link">Logout</a> : ''}
                </div>
                <ErrorToast show={showError} onClose={handleCloseError} message={errorMessage}/>
            </header>
            <main>
                {isLoggedIn ? (
                    <>
                        {showForm ? (
                            <TaskForm onBack={() => setShowForm(false)} onSubmit={handleFormSubmit}/>
                        ) : (
                            <>
                                <Button className="add-task-button" onClick={handleAddTaskClick}>Add new task</Button>
                                <Board onUpdateTasks={fetchTasks} setSearch={setSearch} filter={filter} sort={sort}
                                       onTaskMove={handleTaskMove}
                                       setFilter={setFilter}
                                       search={search}
                                       setSort={setSort} columns={columns}/>
                            </>
                        )}
                    </>
                ) : (
                    <LoginForm onLogin={handleLogin}/>
                )}
            </main>
        </div>
    );
}

export default App;
