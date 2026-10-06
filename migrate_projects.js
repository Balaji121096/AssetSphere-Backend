const mysql = require('mysql2/promise');

async function run() {
  const pool = await mysql.createPool({
    host: 'localhost', port: 3306,
    user: 'root', password: 'Urcts@2026',
    database: 'assetsphere_db',
    multipleStatements: true
  });

  const statements = [
    `CREATE TABLE IF NOT EXISTS projects (
      project_id INT AUTO_INCREMENT PRIMARY KEY,
      project_code VARCHAR(50) UNIQUE NOT NULL,
      project_name VARCHAR(255) NOT NULL,
      description TEXT,
      client_department VARCHAR(255),
      manager_employee_id INT,
      start_date DATE,
      expected_end_date DATE,
      actual_end_date DATE,
      priority ENUM('Low','Medium','High','Critical') DEFAULT 'Medium',
      status ENUM('Planning','Not Started','In Progress','On Hold','Completed','Cancelled') DEFAULT 'Planning',
      objectives TEXT,
      notes TEXT,
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (manager_employee_id) REFERENCES employees(employee_id) ON DELETE SET NULL,
      FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS project_members (
      member_id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      employee_id INT NOT NULL,
      project_role VARCHAR(100) DEFAULT 'Member',
      assigned_date DATE DEFAULT (CURRENT_DATE),
      status ENUM('Active','Inactive') DEFAULT 'Active',
      added_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_project_member (project_id, employee_id),
      FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
      FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
      FOREIGN KEY (added_by) REFERENCES users(user_id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS project_tasks (
      task_id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      task_name VARCHAR(255) NOT NULL,
      description TEXT,
      assigned_employee_id INT,
      priority ENUM('Low','Medium','High','Critical') DEFAULT 'Medium',
      status ENUM('To Do','In Progress','Blocked','Completed','Cancelled') DEFAULT 'To Do',
      start_date DATE,
      due_date DATE,
      estimated_hours DECIMAL(8,2) DEFAULT 0,
      actual_hours DECIMAL(8,2) DEFAULT 0,
      percent_complete TINYINT DEFAULT 0,
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
      FOREIGN KEY (assigned_employee_id) REFERENCES employees(employee_id) ON DELETE SET NULL,
      FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS project_time_logs (
      log_id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      task_id INT,
      employee_id INT NOT NULL,
      log_date DATE NOT NULL,
      start_time TIME,
      end_time TIME,
      break_minutes INT DEFAULT 0,
      total_hours DECIMAL(8,2) DEFAULT 0,
      work_note TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
      FOREIGN KEY (task_id) REFERENCES project_tasks(task_id) ON DELETE SET NULL,
      FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS project_updates (
      update_id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      employee_id INT NOT NULL,
      update_date DATE NOT NULL,
      tasks_worked_on TEXT,
      work_completed TEXT,
      work_in_progress TEXT,
      issues_blockers TEXT,
      next_planned_work TEXT,
      time_spent DECIMAL(8,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
      FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS project_meetings (
      meeting_id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      meeting_date DATE NOT NULL,
      start_time TIME,
      end_time TIME,
      meeting_type VARCHAR(100) DEFAULT 'General',
      participants TEXT,
      agenda TEXT,
      meeting_notes TEXT,
      action_items TEXT,
      next_followup_date DATE,
      status ENUM('Upcoming','Completed','Cancelled') DEFAULT 'Upcoming',
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS project_files (
      file_id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      file_name VARCHAR(255) NOT NULL,
      file_path VARCHAR(500) NOT NULL,
      file_size INT,
      file_type VARCHAR(100),
      uploaded_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
      FOREIGN KEY (uploaded_by) REFERENCES users(user_id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS project_activity (
      activity_id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      user_id INT,
      action_type VARCHAR(100) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
  ];

  for (const stmt of statements) {
    await pool.query(stmt);
    console.log('Created table OK');
  }

  console.log('All project tables created successfully!');
  const [tables] = await pool.query("SHOW TABLES LIKE 'project%'");
  console.log('Project tables:', tables.map(t => Object.values(t)[0]).join(', '));
  await pool.end();
}

run().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
