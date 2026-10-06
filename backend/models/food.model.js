import db from '../config/database.js';

class FoodModel {
    static async addFood({ name, video, foodPartnerId }) {
        try {
            const [result] = await db.query(
                'insert into Food(name,video,foodPartnerId) values(?,?,?)',
                [name, video, foodPartnerId]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async getAllFood() {
        try {
            const [rows] = await db.query(`
                SELECT f.*, fp.fullname AS restaurantName
                FROM Food f
                LEFT JOIN foodpartner fp ON f.foodPartnerId = fp.id
            `);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    //check if user already liked 
    static async hasUserLiked(userId, foodId){
        const [rows]=await db.query('select id from food_likes where userId = ? and foodId = ?',
            [userId,foodId]
        );
        return rows.length > 0 ;
    }

    static async likeFood(userId, foodId) {
        const connection = await db.getConnection();
        try {
           
            await connection.beginTransaction();
            
            await connection.query('insert into food_likes(userId,foodId) values(?,?)',
                [userId,foodId]);
            
            await connection.query('update food set likes=likes+1 where id=?',
                [foodId] );

            await connection.commit();
            return {success:true,message:'Liked successfully'};
        } catch (error) {
            await connection.rollback();
            throw error;
        }
        finally{
            connection.release();
        }
    }

    static async unlikeFood(userId,foodId){
        const connection = await db.getConnection();
        try{
            await connection.beginTransaction();
            await connection.query(
                'delete from food_likes where userId = ? and foodId = ?',
                [userId,foodId]);
            await connection.query(
                'update food set likes = greatest(likes-1,0) where id = ?',
                [foodId]);
            await connection.commit();
            return {success:true,message:'Unliked successfully'};
        }
        catch(error){
            await connection.rollback();
            throw error;
        }finally{
            connection.release();
        }
    }
}
export { FoodModel };
