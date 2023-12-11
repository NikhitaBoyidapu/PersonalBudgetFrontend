  import React, { useState, useEffect } from 'react';
  import { Link } from 'react-router-dom';
  import axios from 'axios';
  import Chart from 'chart.js/auto';

   export const calculateDifferenceForCategoryAndMonth = (categoryName, month, dataSource) => {
    const categoryIndex = dataSource.labels.indexOf(categoryName);
  
    if (categoryIndex !== -1) {
      const budget = dataSource.datasets[0].data[categoryIndex];
      const expenses = dataSource.datasets[0].expense[categoryIndex];
  
      // Assuming dataSource.labels and dataSource.datasets[0].month are in lowercase
      const matchingMonthIndex = dataSource.datasets[0].month.indexOf(month.toLowerCase());
  
      if (matchingMonthIndex !== -1 && categoryIndex !== -1 && matchingMonthIndex === categoryIndex) {
        const difference = budget - expenses;
        return difference;
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
  
  function Dashboard() {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('jwt');
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    function decodingJWT(token) {
      try {
          const base64payload = (token.split('.')[1]).replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64payload).split('').map(function(c) {
               return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
  
          return JSON.parse(jsonPayload);
          } catch (error) {
              console.error('Error decoding JWT token:', error);
              return {};
          }
      }
      useEffect(() => {
        console.log('LoginPage - Initial Authenticated:', localStorage.getItem('jwt'));
        const existingToken = localStorage.getItem('jwt');
        if (existingToken) {
          const decodedToken = decodingJWT(existingToken);
          const issuedAt = decodedToken.iat; 
          const expiresIn = decodedToken.exp - issuedAt;
          console.log('LoginPage - expiresIn:', expiresIn);
          const currentTimeInSeconds = Math.floor(Date.now() / 1000);
          console.log('currentTimeInSeconds::',currentTimeInSeconds);
         // Show a warning popup 20 seconds before the token expires
      const warningTime = expiresIn - 20;
      const warningTimeout = setTimeout(() => {
        const userResponse = window.confirm('Your session will expire in 20 seconds. Do you want to continue?');

        if (!userResponse || currentTimeInSeconds-issuedAt>expiresIn) {
          // User clicked 'Cancel', logout the user

          localStorage.removeItem('jwt');
          localStorage.removeItem('username');
          window.location.reload();
        }
      }, warningTime * 1000);

      // Clear the warning timeout when the component unmounts
      return () => clearTimeout(warningTimeout);
    }
  }, []);

    const options = months.map((month) => ({
      label: month,
      value: month.toLowerCase(), // using lowercase for consistency
    }));

    const [selectedMonth1, setSelectedMonth1] = React.useState('');
    const [selectedMonth2, setSelectedMonth2] = React.useState('');

    const handleChange1 = (event) => {
      setSelectedMonth1(event.target.value);
    };
    const handleChange2 = (event) => {
      setSelectedMonth2(event.target.value);
    };
    const [dataSource, setDataSource] = useState({
      datasets: [
        {
          data: [],
          backgroundColor: [],
          expense: [],
          month: [],
        },
      ],
      labels: [],
    });
    const createChart = () => {
      const ctx = document.getElementById('myChart').getContext('2d');
      const existingChart = Chart.getChart(ctx);
      if (existingChart) {
        existingChart.destroy();
      }
    
      const filteredExpenses = dataSource.datasets[0].expense.filter(
        (expense, index) => dataSource.datasets[0].month[index] === selectedMonth1
      );
      const filteredBudget = dataSource.datasets[0].data.filter(
        (budget, index) => dataSource.datasets[0].month[index] === selectedMonth1
      );
      const filteredLabels = dataSource.labels.filter(
        (_, index) => dataSource.datasets[0].month[index] === selectedMonth1
      );
    
      if (filteredLabels.length === 0) {
        // If no expenses for the selected month, display a message
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No expenses this month', ctx.canvas.width / 2, ctx.canvas.height / 2);
      } else {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: filteredLabels,
          datasets: [
            {
              label: 'Total Budget',
              data: filteredBudget,
              backgroundColor: 'rgba(0, 0, 139, 0.65)',
              borderWidth: 1,
            },
            {
              label: 'Expense',
              data: filteredExpenses,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              display: false,
            },
          },
        },
      });
    };
  };

    const createPieChart = () => {
      const ctx = document.getElementById('chart2').getContext('2d');
    
      // Check if a chart instance already exists and destroy it
      const existingChart = Chart.getChart(ctx);
      if (existingChart) {
        existingChart.destroy();
      }
    
      const filteredData = dataSource.datasets[0].expense.filter(
        (expense, index) => dataSource.datasets[0].month[index] === selectedMonth2
      );
      const filteredLabels = dataSource.labels.filter(
        (_, index) => dataSource.datasets[0].month[index] === selectedMonth2
      );
      const filteredColors = dataSource.datasets[0].backgroundColor.filter(
        (_, index) => dataSource.datasets[0].month[index] === selectedMonth2
      );
    
      if (filteredData.length === 0) {
        // If no expenses for the selected month, display a message
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No expenses this month', ctx.canvas.width / 2, ctx.canvas.height / 2);
      } else {
        // If there are expenses, create the pie chart
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: filteredLabels,
            datasets: [
              {
                data: filteredData,
                backgroundColor: filteredColors, // Use colors from the database
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              position: 'right',
            },
          },
        });
      }
    };
    const date = new Date();
    const monthName = months[date.getMonth()];
    console.log(monthName);
    const createStackedLineChart = () => {
      const ctx = document.getElementById('chart3').getContext('2d');
      const existingChart = Chart.getChart(ctx);
      if (existingChart) {
        existingChart.destroy();
      }
      const filteredExpenses = dataSource.datasets[0].expense.filter(
        (expense, index) => dataSource.datasets[0].month[index] === monthName.toLowerCase()
      );
      const filteredBudget = dataSource.datasets[0].data.filter(
        (budget, index) => dataSource.datasets[0].month[index] === monthName.toLowerCase()
      );
      
      if (filteredBudget.length === 0) {
        // If no expenses for the selected month, display a message
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No expenses this month', ctx.canvas.width / 2, ctx.canvas.height / 2);
      } else {
      const amountDifference = filteredBudget.map((budget, index) => {
        const expenses = filteredExpenses[index];
        return budget - expenses;
      });
    
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: dataSource.labels,
          datasets: [
            {
              label: 'Budget',
              data: filteredBudget,
              borderColor: 'rgba(0, 255, 0, 0.8)',
              backgroundColor: 'rgba(0, 255, 0, 0.2)',
              borderWidth: 2,
              fill: 'origin',
            },
            {
              label: 'Expenses',
              data: filteredExpenses,
              borderColor: 'rgba(255, 0, 0, 0.8)',
              backgroundColor: 'rgba(255, 0, 0, 0.2)',
              borderWidth: 2,
              fill: '-1',
            },
            {
              label: 'Amount Difference',
              data: amountDifference,
              borderColor: 'rgba(0, 0, 255, 0.8)',
              backgroundColor: 'rgba(0, 0, 255, 0.2)',
              borderWidth: 2,
              fill: '-1',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Months',
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Amount',
              },
            },
          },
        },
      });
    };
  };
    
    useEffect(() => {
      createPieChart(); 
    }, [selectedMonth2, dataSource]);
    useEffect(() => {
      createChart(); 
    }, [selectedMonth1, dataSource]);

    const getBudget = () => {
      axios
        .get(`https://seashell-app-pjx64.ondigitalocean.app/api/budget/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(function (res) {
          console.log(res.data);
          for (var i = 0; i < res.data.length; i++) {
            dataSource.datasets[0].data[i] = res.data[i].budget;
            dataSource.labels[i] = res.data[i].title;
            dataSource.datasets[0].backgroundColor[i] = res.data[i].color;
            dataSource.datasets[0].expense[i] = res.data[i].expense;
            dataSource.datasets[0].month[i] = res.data[i].month;
          }
          // createChart();
          createStackedLineChart();
        })
        .catch(function (error) {
          console.error('Error fetching budget data:', error);
        });
    };

    useEffect(() => {
      getBudget();
    }, []);

    return (
      <div className="dashboard">
        <section className="dash-head">
          <h1 className="dashboard-head">Welcome to <b>{username}'s </b>Dashboard</h1>
          <Link to="/newcategory" className="create-category">
            Add/ Modify Categories
          </Link>
          <Link to="/deletecategory" className="create-category">
            Delete Categories
          </Link>
          <Link to="/login" className="logout-link">
            Logout
          </Link>
        </section>
        <section className="charts">
  <article className="chart chart1">
    <h3>Budget and Expenses based on Category for {selectedMonth1}</h3>
    <label>
  Select a month:
  <select value={selectedMonth1} onChange={handleChange1} aria-label="Select a month">
    <option value={''} disabled hidden>
      Select a month
    </option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</label>
    <div>
      <canvas id="myChart"> </canvas>
    </div>
  </article>
  <article className="chart chart2">
    <h3>All the expenses for <b>{selectedMonth2}</b> </h3>
    <div>
    <label>
  Select a month:
  <select value={selectedMonth2} onChange={handleChange2} aria-label="Select a month">
    <option value={''} disabled hidden>
      Select a month
    </option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</label>
      <div>
        <canvas id="chart2"> </canvas>
      </div>
    </div>
  </article>
  <article className="chart chart3">
    <h3>Ranges for budget and expenses for this month </h3>
    <div>
      <canvas id="chart3"> </canvas>
    </div>
  </article>
</section>
      </div>
    );
  }

  export default Dashboard;
