import db from "../config/database.js";

class FoodPartner {
    
    static async findOne({ email }) {
        try {
            const [rows] = await db.query("Select * From foodpartner where email=?", [email]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async create({ fullname, email, password }) {
        try {
            const [result] = await db.query(
                'Insert into foodpartner(fullname,email,password) values(?,?,?)',
                [fullname, email, password]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async findFoodPartnerById(foodpartnerid) {
        try {
            const [rows] = await db.query("Select * from foodpartner where id=?", [foodpartnerid]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getProfileData(id) {
        try {
            const query = ` SELECT fp.fullname, fp.email, f.id as videoId, f.name as videoName, 
            f.video as videoUrl,f.likes as likes FROM foodpartner fp LEFT JOIN Food f ON fp.id = f.foodPartnerId
    WHERE fp.id = ? `;
            const [rows] = await db.query(query, [id]);

            return rows;
        } catch (error) {
            throw error;
        }
    }

}
export default FoodPartner;
