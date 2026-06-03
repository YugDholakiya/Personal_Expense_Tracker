const db = require("../config/db");

const Expense = {
    create: async (expenseData) => {
        const { title, price, category, type, userId, date } = expenseData;
        const query = "INSERT INTO expenses (title, price, category, type, userId, expense_date, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())";
        const expenseDate = date || new Date();
        const [result] = await db.execute(query, [title, price, category, type, userId, expenseDate]);
        return result;
    },

    find: async (conditions) => {
        let query = "SELECT * FROM expenses WHERE 1=1";
        const params = [];

        if (conditions.userId) {
            query += " AND userId = ?";
            params.push(conditions.userId);
        }

        if (conditions.date) {
            if (conditions.date.$gte && conditions.date.$lte) {
                query += " AND expense_date BETWEEN ? AND ?";
                params.push(conditions.date.$gte, conditions.date.$lte);
            } else if (conditions.date.$gte) {
                query += " AND expense_date >= ?";
                params.push(conditions.date.$gte);
            } else if (conditions.date.$lte) {
                query += " AND expense_date <= ?";
                params.push(conditions.date.$lte);
            }
        }

        const [rows] = await db.execute(query, params);
        return rows;
    },

    findByIdAndUpdate: async (id, updateData) => {
        const updates = [];
        const params = [];

        for (const [key, value] of Object.entries(updateData)) {
            if (key !== 'id' && key !== '_id') {
                updates.push(`${key} = ?`);
                params.push(value);
            }
        }

        if (updates.length === 0) return null;

        updates.push("updatedAt = NOW()");
        params.push(id);

        const query = `UPDATE expenses SET ${updates.join(", ")} WHERE id = ?`;
        const [result] = await db.execute(query, params);
        return result;
    },

    findByIdAndDelete: async (id) => {
        const query = "DELETE FROM expenses WHERE id = ?";
        const [result] = await db.execute(query, [id]);
        return result;
    },

    findById: async (id) => {
        const query = "SELECT * FROM expenses WHERE id = ?";
        const [rows] = await db.execute(query, [id]);
        return rows[0] || null;
    }
};

module.exports = Expense;