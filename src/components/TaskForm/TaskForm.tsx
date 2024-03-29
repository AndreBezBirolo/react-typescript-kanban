import React, { useCallback, useState } from "react";
import { ITaskBase } from "../../interfaces/interfaces";
import './TaskForm.css'
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface TaskFormProps {
    onSubmit: (taskData: ITaskBase) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({onSubmit}) => {
    const navigate = useNavigate();
    const [taskData, setTaskData] = useState({
        name: '',
        due_date: new Date(),
        status: ''
    });

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setTaskData({...taskData, [name]: value});
    }, [taskData]);

    const handleChangeSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setTaskData({...taskData, [name]: value});
    }, [taskData]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(taskData);
    }, [onSubmit, taskData]);

    return (
        <div className="center">
            <div className="task-form-container">
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="taskName">
                        <Form.Label>Task name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={taskData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="due_date">
                        <Form.Label>Due date</Form.Label>
                        <Form.Control
                            type="date"
                            name="due_date"
                            value={taskData.due_date instanceof Date ? taskData.due_date.toISOString().split('T')[0] : taskData.due_date}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="status">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            name="status"
                            value={taskData.status}
                            onChange={handleChangeSelect}
                            required
                        >
                            <option value="">Select a status</option>
                            <option value="todo">To do</option>
                            <option value="doing">Doing</option>
                            <option value="ready">Ready</option>
                        </Form.Select>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Send
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/')}>
                        Back
                    </Button>
                </Form>
            </div>
        </div>
    );
};