const express = require('express');
const {
    ListComments,
    AddComment,
    DeleteComment
} = require('../../../controllers/admin/comment/commentController');
const { isAdmin } = require('../../../middleware/isAdmin');

const router = express.Router();

router.route('/list')
    .all(isAdmin)
    .get(ListComments);

router.route('/add')
    .all(isAdmin)
    .post(AddComment);

router.route('/delete')
    .all(isAdmin)
    .post(DeleteComment);

module.exports = { CommentRoutes: router };