require('dotenv').config();
const db = require('./config/db');

async function migrate() {
    try {
        await db.query("CREATE TABLE IF NOT EXISTS project_roles (role_id INT AUTO_INCREMENT PRIMARY KEY, role_name VARCHAR(100) NOT NULL UNIQUE)");
        
        const roles = [
            "Drafting", "Designer", "Architect", "Bim co-ordinator", "Senior bim modeler", "Junior BIM modeler", "Member"
        ];
        
        for (const role of roles) {
            await db.query("INSERT IGNORE INTO project_roles (role_name) VALUES (?)", [role]);
        }
        
        console.log("Migration successful");
    } catch(err) {
        console.error(err);
    } finally {
        process.exit();
    }
}
migrate();
