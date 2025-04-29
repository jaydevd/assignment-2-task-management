const express = require('express');
const {
    ListComments,
    AddComment,
    DeleteComment
} = require('../../../controllers/admin/comment/commentController');
const { isUser } = require('../../../middleware/isUser');

const router = express.Router();

router.route('/list')
    .all(isUser)
    .get(ListComments);

router.route('/add')
    .all(isUser)
    .post(AddComment);

router.route('/delete')
    .all(isUser)
    .post(DeleteComment);

module.exports = { CommentRoutes: router };