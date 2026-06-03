const db = require("../config/db");

const User = {
    create: async (userData) => {
        const { name, email, password } = userData;
        const query = "INSERT INTO users (name, email, password, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())";
        const [result] = await db.execute(query, [name, email, password]);
        return result;
    },

    findOne: async (conditions) => {
        if (conditions.email) {
            const query = "SELECT * FROM users WHERE email = ?";
            const [rows] = await db.execute(query, [conditions.email]);
            return rows[0] || null;
        }
        if (conditions._id || conditions.id) {
            const query = "SELECT * FROM users WHERE id = ?";
            const [rows] = await db.execute(query, [conditions._id || conditions.id]);
            return rows[0] || null;
        }
        return null;
    },

    findById: async (id) => {
        const query = "SELECT * FROM users WHERE id = ?";
        const [rows] = await db.execute(query, [id]);
        return rows[0] || null;
    }
};

module.exports = User;