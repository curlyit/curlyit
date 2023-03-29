const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const courseSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            maxLength: 255,
        },
        description: {
            type: String,
            maxLength: 500,
        },
        image: {
            type: String,
        },
        videoId: {
            type: String,
            required: true,
        },
        level: {
            type: String,
        },
        slug: {
            type: String,
            slug: 'name',
            unique: true,
        },
    },
    { timestamps: true },
);

courseSchema.query.sortable = function (req) {
    if (req.query.hasOwnProperty('_sort')) {
        const isValidType = ['asc', 'desc'].includes(req.query.type);

        return this.sort({
            [req.query.column]: isValidType ? req.query.type : 'desc',
        });
    }
    return this;
};

courseSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});
mongoose.plugin(slug);

module.exports = mongoose.model('Course', courseSchema);
