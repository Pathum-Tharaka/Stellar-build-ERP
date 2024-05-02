import axios from 'axios';
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useGlobalContext } from '../../Context/globalContext';

const URL = "http://localhost:5000/projects";
const IURL = "http://localhost:5000/finance/get-incomes";

const fetchProjects = async () => {
  return await axios.get(URL).then((res) => res.data);
};

const fetchIncomes = async () => {
  return await axios.get(IURL).then((res) => res.data);
};

const fetchExpenses = async () => {
  return await axios.get("http://localhost:5000/finance/get-expenses").then((res) => res.data);
};


function Project() {
  const [projects, setProjects] = useState([]);
  const { incomes, getIncomes, expenses, getExpenses } = useGlobalContext();
  

  useEffect(() => {
    fetchProjects().then((data) => setProjects(data.project));
    getIncomes();
    getExpenses();
  }, []);

  // Function to calculate total income for a project
  const getTotalIncome = (projectName) => {
    return incomes.filter(income => income.project === projectName)
                  .reduce((total, income) => total + income.amount, 0);
  };

  // Function to calculate total expense for a project
  const getTotalExpense = (projectName) => {
    return expenses.filter(expense => expense.project === projectName)
                   .reduce((total, expense) => total + expense.amount, 0);
  };

  // Function to calculate total balance for a project
  const getTotalBalance = (projectName) => {
    return getTotalIncome(projectName) - getTotalExpense(projectName);
  };

  // Function to calculate total balance for all projects
  const getTotalOverallBalance = () => {
    return projects.reduce((total, project) => total + getTotalBalance(project.projectName), 0);
  };

  return (
    <ProjectStyled>
      <div>
        <h1>Projects</h1>
        <ul>
          {projects.map(project => (
            <li className="history-item" key={project._id}>
              {project.projectName}
              <ul>
                <li>Total Income: <span className='income'>{getTotalIncome(project.projectName)}</span></li>
                <li>Total Expense: <span className='expense'>{getTotalExpense(project.projectName)}</span></li>
                <li>Total Balance: {getTotalBalance(project.projectName)}</li>
              </ul>
            </li>
          ))}
        </ul>
        <div className="total-balance">Total Overall Balance: {getTotalOverallBalance()}</div>
      </div>
    </ProjectStyled>
  );
}

const ProjectStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .history-item{
        background: #D9D9D9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        padding: 1rem;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .income{
      color: green;
    }

    .expense{
      color: red;
    }

    .total-balance{
      font-weight: bold;
    }
`;

export default Project;