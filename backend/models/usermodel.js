import db from '../config/database.js';

class UserModel {

    static async findOne({ email }) {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async create({ fullname, email, password }) {
        try {
            const [result] = await db.query(
                'INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)',
                [fullname, email, password]);
                
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }
}

export default UserModel;
