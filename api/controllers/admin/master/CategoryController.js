/**
 * @name CategoryController
 * @file CategoryController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description Methods for add, update and delete categories
 * @author Jaydev Dwivedi (Zignuts)
 */

const { v4: uuidv4 } = require('uuid');
const Validator = require("validatorjs");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Category } = require('./../../../models/Category');
const { HTTP_STATUS_CODES } = require('./../../../config/constants');
const { QueryTypes } = require('sequelize');

const AddCategory = async (req, res) => {
    try {
        const { category, sub_categories } = req.body;
        const id = uuidv4();

        const query = `
        INSERT INTO categories (id, name, sub_categories, isActive, isDeleted, createdAt, createdBy) VALUES
        ('${id}', '${category}','${sub_categories || null}', true, false, ${Math.floor(Date.now() / 1000)}, '${id}');`;

        const [result, metadata] = await sequelize.query(query);

        if (!result) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                message: '',
                data: '',
                error: ''
            })
        }

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            message: '',
            data: '',
            error: ''
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: '',
            data: '',
            error: error.message
        })
    }
}

const DeleteCategory = async (req, res) => {
    try {

        const { id } = req.body;
        const res = Category.update({ isActive: false, isDeleted: true }, { where: { id: id } });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            message: '',
            data: '',
            error: ''
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: '',
            data: '',
            error: error.message
        })
    }
}

const ListCategories = async (req, res) => {
    try {

        // Pagination
        const { query, categoryID, page } = req.query;
        const limit = 20;
        const skip = (page - 1) * limit;

        // List categories with filter
        const [categories, metadata] = await sequelize.query(`SELECT id, name, sub_categories FROM categories WHERE name LIKE '%${query || ''}%' AND id iLIKE '%${categoryID || ''}%' LIMIT ${limit || 10} OFFSET ${skip || 0}`);

        if (categories == []) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                message: 'No categories found',
                data: '',
                error: ''
            })
        }

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            message: '',
            data: categories,
            error: ''
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: '',
            data: '',
            error: error.message
        })
    }
}

const AddSubCategory = async (req, res) => {
    try {
        const { category, subCategory } = req.body;
        const id = uuidv4();

        const query = `
        UPDATE categories
        SET sub_categories = sub_categories || '[{"id": ${id}, "name": "${subCategory}"}]'::jsonb
        WHERE id = '${category}';`

        const [result, metadata] = sequelize.query(query);

        if (!result) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                message: '',
                data: '',
                error: ''
            })
        }

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            message: '',
            data: '',
            error: ''
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: '',
            data: '',
            error: error.message
        })
    }
}



module.exports = {
    ListCategories,
    AddCategory,
    DeleteCategory,
    AddSubCategory,
    AddSubCategory
}