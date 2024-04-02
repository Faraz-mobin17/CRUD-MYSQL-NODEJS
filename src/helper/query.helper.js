import db from "../db/connection.db.js";
import { ApiError } from "../utils/ApiHandler.utils.js";
import { HttpStatusCodes } from "../utils/httpStatusCodes.utils.js";

class Model {
  static async findById(table, userId) {
    try {
      const query = `SELECT * FROM ${table} WHERE id = ?`;
      const [rows] = await db.execute(query, [userId]);
      if (rows.length === 0) {
        throw new ApiError(HttpStatusCodes.NOT_FOUND, "User not found");
      }
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findOne(table, criteria) {
    try {
      let query = `SELECT * FROM ${table} WHERE `;
      const keys = Object.keys(criteria);
      const placeholders = keys.map((key) => `${key} = ?`).join(" AND ");
      query += placeholders;

      const values = Object.values(criteria);

      const [rows] = await db.execute(query, values);
      console.log(rows);
      if (rows.length === 0) {
        return null;
      }
      console.log(rows);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll(table, criteria = {}) {
    try {
      let query = `SELECT * FROM ${table}`;
      if (Object.keys(criteria).length > 0) {
        query += " WHERE ";
        const keys = Object.keys(criteria);
        const placeholders = keys.map((key) => `${key} = ?`).join(" AND ");
        query += placeholders;
        console.log(query);
        const values = Object.values(criteria);
        const [rows] = await db.execute(query, values);
        return rows;
      }
      query = `SELECT * FROM ${table}`;
      const [rows] = await db.execute(query);
      // console.log(rows);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async create(table, data) {
    try {
      if (Object.keys(data).length === 0) {
        throw new Error("No data provided for insertion");
      }

      const keys = Object.keys(data);
      const values = Object.values(data);

      const placeholders = keys.map(() => "?").join(", ");
      const query = `INSERT INTO ${table} (${keys.join(
        ", "
      )}) VALUES (${placeholders})`;

      console.log(query);
      const [result] = await db.execute(query, values);

      return result.insertId; // Return the ID of the newly inserted record
    } catch (error) {
      throw error;
    }
  }
  // Assuming you've established a database connection and imported the necessary modules

  static async update(table, data, criteria) {
    try {
      if (Object.keys(data).length === 0) {
        throw new Error("No data provided to update");
      }

      let query = `UPDATE ${table} SET `;
      const setValues = [];
      const criteriaKeys = Object.keys(criteria);
      const criteriaValues = Object.values(criteria);

      Object.entries(data).forEach(([key, value], index, array) => {
        setValues.push(value);
        if (index === array.length - 1) {
          query += `${key} = ? `;
        } else {
          query += `${key} = ?, `;
        }
      });

      query += "WHERE ";
      query += criteriaKeys.map((key) => `${key} = ?`).join(" AND ");

      const values = [...setValues, ...criteriaValues];

      const [result] = await db.execute(query, values);

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async remove(table, criteria) {
    try {
      if (Object.keys(criteria).length === 0) {
        throw new Error("No criteria provided for deletion");
      }

      let query = `DELETE FROM ${table} WHERE `;
      const keys = Object.keys(criteria);
      const values = Object.values(criteria);

      query += keys.map((key) => `${key} = ?`).join(" AND ");

      const [result] = await db.execute(query, values);

      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default Model;
